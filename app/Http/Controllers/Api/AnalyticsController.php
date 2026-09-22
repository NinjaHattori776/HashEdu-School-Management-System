<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ExamSubject;
use App\Models\FeeInvoice;
use App\Models\Mark;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\TeacherSubjectClass;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    // GET /api/super-admin/analytics — school-wide
    public function schoolOverview()
    {
        $totalStudents = Student::count();
        $totalAttendanceRecords = Attendance::count();
        $presentCount = Attendance::where('status', 'present')->count();
        $attendanceRate = $totalAttendanceRecords > 0 ? round(($presentCount / $totalAttendanceRecords) * 100, 1) : 0;

        $passRate = $this->overallPassRate();
        $feeStats = $this->feeCollectionStats();

        return response()->json([
            'total_students' => $totalStudents,
            'attendance_rate' => $attendanceRate,
            'pass_rate' => $passRate,
            'fee_collection_rate' => $feeStats['rate'],
            'total_fee_due' => $feeStats['due'],
            'total_fee_collected' => $feeStats['collected'],
            'by_class' => $this->perClassBreakdown(),
        ]);
    }

    // GET /api/admin/analytics — same shape, admin-visible subset (reuses school overview for now)
    public function classOverview()
    {
        return response()->json(['by_class' => $this->perClassBreakdown()]);
    }

    // GET /api/teacher/analytics — per-subject class average for this teacher's assignments
    public function teacherOverview(Request $request)
    {
        $teacherId = $request->user()->id;

        $assignments = TeacherSubjectClass::where('teacher_user_id', $teacherId)
            ->with('subject', 'schoolClass')
            ->get();

        $rows = $assignments->map(function ($a) {
            $examSubjectIds = ExamSubject::whereHas('exam', fn ($q) => $q->where('school_class_id', $a->school_class_id))
                ->where('subject_id', $a->subject_id)
                ->pluck('id');

            $avg = Mark::whereIn('exam_subject_id', $examSubjectIds)->avg('marks_obtained');

            return [
                'subject' => $a->subject->name,
                'class' => $a->schoolClass->name,
                'average_marks' => $avg ? round($avg, 1) : null,
            ];
        });

        return response()->json($rows->values());
    }

    private function overallPassRate(): float
    {
        $marks = Mark::with('examSubject')->whereNotNull('marks_obtained')->get();
        if ($marks->isEmpty()) {
            return 0;
        }
        $passed = $marks->filter(fn ($m) => $m->marks_obtained >= ($m->examSubject->pass_marks ?? 35))->count();

        return round(($passed / $marks->count()) * 100, 1);
    }

    private function feeCollectionStats(): array
    {
        $invoices = FeeInvoice::with('payments')->get();
        $due = $invoices->sum('amount_due');
        $collected = $invoices->sum(fn ($i) => $i->payments->sum('amount_paid'));

        return [
            'due' => round($due, 2),
            'collected' => round($collected, 2),
            'rate' => $due > 0 ? round(($collected / $due) * 100, 1) : 0,
        ];
    }

    private function perClassBreakdown()
    {
        return SchoolClass::withCount('students')->orderBy('numeric_level')->get()->map(function ($class) {
            $studentIds = Student::where('school_class_id', $class->id)->pluck('id');
            $attendance = Attendance::whereIn('student_id', $studentIds);
            $total = (clone $attendance)->count();
            $present = (clone $attendance)->where('status', 'present')->count();

            return [
                'class' => $class->name,
                'students' => $class->students_count,
                'attendance_rate' => $total > 0 ? round(($present / $total) * 100, 1) : null,
            ];
        });
    }
}
