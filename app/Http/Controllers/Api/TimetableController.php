<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $query = Timetable::with('schoolClass', 'section', 'subject', 'teacher:id,name');
        if ($request->school_class_id) {
            $query->where('school_class_id', $request->school_class_id);
        }
        if ($request->section_id) {
            $query->where('section_id', $request->section_id);
        }

        return $query->orderBy('day_of_week')->orderBy('start_time')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_user_id' => 'required|exists:users,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'day_of_week' => 'required|in:mon,tue,wed,thu,fri,sat',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
        ]);

        return response()->json(Timetable::create($data)->load('schoolClass', 'section', 'subject', 'teacher'), 201);
    }

    public function destroy(Timetable $timetable)
    {
        $timetable->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // GET /api/portal/my-timetable — for a student (their class/section) or teacher (their assignments)
    public function mine(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'student' && $user->studentProfile) {
            $sp = $user->studentProfile;

            return Timetable::with('subject', 'teacher:id,name')
                ->where('school_class_id', $sp->school_class_id)
                ->where('section_id', $sp->section_id)
                ->orderBy('day_of_week')->orderBy('start_time')->get();
        }

        if ($user->role === 'teacher') {
            return Timetable::with('subject', 'schoolClass', 'section')
                ->where('teacher_user_id', $user->id)
                ->orderBy('day_of_week')->orderBy('start_time')->get();
        }

        return response()->json([]);
    }
}
