<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Section::with('schoolClass');
        if ($request->school_class_id) {
            $query->where('school_class_id', $request->school_class_id);
        }
        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'name' => 'required|string|max:10',
            'capacity' => 'nullable|integer|min:1',
        ]);

        return response()->json(Section::create($data), 201);
    }

    public function update(Request $request, Section $section)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:10',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $section->update($data);
        return response()->json($section);
    }

    public function destroy(Section $section)
    {
        $section->delete();
        return response()->json(['message' => 'Deleted']);
    }
}