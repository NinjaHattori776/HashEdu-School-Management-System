<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $query = Exam::with(['examType', 'schoolClass', 'examSubjects.subject']);
        if ($request->school_class_id) {
            $query->where('school_class_id', $request->school_class_id);
        }

        return $query->orderByDesc('start_date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'exam_type_id' => 'required|exists:exam_types,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:150',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        return response()->json(Exam::create($data)->load('examType', 'schoolClass'), 201);
    }

    public function update(Request $request, Exam $exam)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:150',
            'exam_type_id' => 'sometimes|exists:exam_types,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        $exam->update($data);

        return response()->json($exam->load('examType', 'schoolClass'));
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function addSubject(Request $request, Exam $exam)
    {
        $data = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'max_marks' => 'required|integer|min:1',
            'pass_marks' => 'required|integer|min:0|lte:max_marks',
            'exam_date' => 'nullable|date',
        ]);

        $examSubject = $exam->examSubjects()->updateOrCreate(
            ['subject_id' => $data['subject_id']],
            ['max_marks' => $data['max_marks'], 'pass_marks' => $data['pass_marks'], 'exam_date' => $data['exam_date'] ?? null]
        );

        return response()->json($examSubject->load('subject'), 201);
    }
}
