<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamType;
use Illuminate\Http\Request;

class ExamTypeController extends Controller
{
    public function index()
    {
        return ExamType::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'weight_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        return response()->json(ExamType::create($data), 201);
    }

    public function update(Request $request, ExamType $examType)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'weight_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        $examType->update($data);

        return response()->json($examType);
    }

    public function destroy(ExamType $examType)
    {
        $examType->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
