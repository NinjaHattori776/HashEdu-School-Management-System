<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherSubjectClass;
use Illuminate\Http\Request;

// Assigns a teacher to teach a subject for a specific class/section/year.
class TeacherAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = TeacherSubjectClass::with(['teacher:id,name,email', 'subject:id,name', 'schoolClass:id,name', 'section:id,name']);
        if ($request->teacher_user_id) {
            $query->where('teacher_user_id', $request->teacher_user_id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_user_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'section_id' => 'required|exists:sections,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        $assignment = TeacherSubjectClass::create($data);

        return response()->json($assignment->load(['teacher', 'subject', 'schoolClass', 'section']), 201);
    }

    public function myAssignments(Request $request)
    {
        return TeacherSubjectClass::with(['subject:id,name', 'schoolClass:id,name', 'section:id,name'])
            ->where('teacher_user_id', $request->user()->id)
            ->get();
    }

    public function destroy(TeacherSubjectClass $teacherSubjectClass)
    {
        $teacherSubjectClass->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
