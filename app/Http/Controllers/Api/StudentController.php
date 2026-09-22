<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['user:id,name,email,phone,status,profile_photo', 'schoolClass:id,name', 'section:id,name']);

        if ($request->school_class_id) {
            $query->where('school_class_id', $request->school_class_id);
        }
        if ($request->section_id) {
            $query->where('section_id', $request->section_id);
        }

        return $query->orderBy('admission_number')->get();
    }

    public function show(Student $student)
    {
        return $student->load(['user', 'schoolClass', 'section', 'academicYear', 'parents']);
    }

    // Creates the User (role=student) and Student profile together.
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'admission_number' => 'required|string|max:50|unique:students,admission_number',
            'school_class_id' => 'required|exists:school_classes,id',
            'section_id' => 'required|exists:sections,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:30',
            'guardian_email' => 'nullable|email',
            'admission_date' => 'nullable|date',
        ]);

        $student = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'student',
                'status' => 'active',
            ]);

            return Student::create([
                'user_id' => $user->id,
                'admission_number' => $data['admission_number'],
                'school_class_id' => $data['school_class_id'],
                'section_id' => $data['section_id'],
                'academic_year_id' => $data['academic_year_id'],
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? null,
                'address' => $data['address'] ?? null,
                'guardian_name' => $data['guardian_name'] ?? null,
                'guardian_phone' => $data['guardian_phone'] ?? null,
                'guardian_email' => $data['guardian_email'] ?? null,
                'admission_date' => $data['admission_date'] ?? null,
            ]);
        });

        return response()->json($student->load(['user', 'schoolClass', 'section']), 201);
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'school_class_id' => 'sometimes|exists:school_classes,id',
            'section_id' => 'sometimes|exists:sections,id',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:30',
            'guardian_email' => 'nullable|email',
            'address' => 'nullable|string',
        ]);

        $student->update($data);
        return response()->json($student->load(['user', 'schoolClass', 'section']));
    }

    public function destroy(Student $student)
    {
        // Deletes the student profile AND the underlying user account.
        $student->user()->delete();
        $student->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
