<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        return SchoolClass::with('sections', 'subjects')->orderBy('numeric_level')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'numeric_level' => 'required|integer|min:1|max:13|unique:school_classes,numeric_level',
        ]);

        return response()->json(SchoolClass::create($data), 201);
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:50',
            'numeric_level' => 'sometimes|integer|min:1|max:13|unique:school_classes,numeric_level,' . $schoolClass->id,
        ]);

        $schoolClass->update($data);
        return response()->json($schoolClass);
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function syncSubjects(Request $request, SchoolClass $schoolClass)
    {
        $data = $request->validate([
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        $schoolClass->subjects()->sync($data['subject_ids']);
        return response()->json($schoolClass->load('subjects'));
    }
}