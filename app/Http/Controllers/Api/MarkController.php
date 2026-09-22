<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamSubject;
use App\Models\Mark;
use Illuminate\Http\Request;

class MarkController extends Controller
{
    // GET /api/teacher/marks/{examSubject} — roster + any marks already entered, for the entry screen
    public function forExamSubject(Request $request, ExamSubject $examSubject)
    {
        $examSubject->load('subject', 'exam.schoolClass');
        $students = \App\Models\Student::where('school_class_id', $examSubject->exam->school_class_id)
            ->with('user:id,name')
            ->get();

        $existing = Mark::where('exam_subject_id', $examSubject->id)->get()->keyBy('student_id');

        $roster = $students->map(function ($student) use ($existing) {
            $mark = $existing->get($student->id);
            return [
                'student_id' => $student->id,
                'admission_number' => $student->admission_number,
                'name' => $student->user->name ?? '',
                'marks_obtained' => $mark->marks_obtained ?? null,
            ];
        });

        return response()->json([
            'exam_subject' => $examSubject,
            'roster' => $roster,
        ]);
    }

    // POST /api/teacher/marks/bulk
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'exam_subject_id' => 'required|exists:exam_subjects,id',
            'records' => 'required|array|min:1',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.marks_obtained' => 'nullable|numeric|min:0',
        ]);

        foreach ($validated['records'] as $record) {
            Mark::updateOrCreate(
                ['exam_subject_id' => $validated['exam_subject_id'], 'student_id' => $record['student_id']],
                [
                    'marks_obtained' => $record['marks_obtained'],
                    'entered_by' => $request->user()->id,
                ]
            );
        }

        return response()->json(['message' => 'Marks saved']);
    }

    // GET /api/portal/my-marks — student/parent view, grouped by exam
    public function mine(Request $request)
    {
        $user = $request->user();
        $students = $user->role === 'student'
            ? collect([$user->studentProfile])->filter()
            : $user->children;

        $result = $students->map(function ($student) {
            $marks = Mark::where('student_id', $student->id)
                ->with('examSubject.subject', 'examSubject.exam')
                ->get()
                ->groupBy(fn ($m) => $m->examSubject->exam->name ?? 'Exam');

            return [
                'student' => ['id' => $student->id, 'name' => $student->user->name ?? ''],
                'exams' => $marks->map(function ($group, $examName) {
                    return [
                        'exam_name' => $examName,
                        'subjects' => $group->map(fn ($m) => [
                            'subject' => $m->examSubject->subject->name,
                            'marks_obtained' => $m->marks_obtained,
                            'max_marks' => $m->examSubject->max_marks,
                        ]),
                    ];
                })->values(),
            ];
        });

        return response()->json($result->values());
    }
}
