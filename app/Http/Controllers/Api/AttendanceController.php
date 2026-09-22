<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    // POST /api/teacher/attendance/bulk — mark a whole class/section for one date
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'section_id' => 'required|exists:sections,id',
            'date' => 'required|date',
            'records' => 'required|array|min:1',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|in:present,absent,late,leave',
        ]);

        foreach ($validated['records'] as $record) {
            Attendance::updateOrCreate(
                ['student_id' => $record['student_id'], 'date' => $validated['date']],
                [
                    'school_class_id' => $validated['school_class_id'],
                    'section_id' => $validated['section_id'],
                    'status' => $record['status'],
                    'marked_by' => $request->user()->id,
                ]
            );
        }

        return response()->json(['message' => 'Attendance saved']);
    }

    // GET /api/portal/attendance/{student}?from=&to= — used by admin/teacher looking up one student
    public function forStudent(Request $request, $studentId)
    {
        $query = Attendance::where('student_id', $studentId);
        if ($request->from) {
            $query->where('date', '>=', $request->from);
        }
        if ($request->to) {
            $query->where('date', '<=', $request->to);
        }

        return response()->json($query->orderBy('date')->get());
    }

    // GET /api/portal/my-attendance — the logged-in student's own record, or a parent's children's records
    public function mine(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'student') {
            $student = $user->studentProfile;
            if (! $student) {
                return response()->json(['message' => 'No student profile linked to this account.'], 404);
            }

            return response()->json([[
                'student' => $student->only(['id', 'admission_number']) + ['name' => $user->name],
                'attendance' => Attendance::where('student_id', $student->id)->orderBy('date', 'desc')->get(),
            ]]);
        }

        if ($user->role === 'parent') {
            $children = $user->children;
            $result = $children->map(function ($child) {
                return [
                    'student' => $child->only(['id', 'admission_number']) + ['name' => $child->user->name ?? ''],
                    'attendance' => Attendance::where('student_id', $child->id)->orderBy('date', 'desc')->get(),
                ];
            });

            return response()->json($result);
        }

        return response()->json([], 200);
    }
}
