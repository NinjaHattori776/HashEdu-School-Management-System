<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use Illuminate\Http\Request;

class FeeStructureController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeStructure::with('schoolClass', 'academicYear', 'feeCategory');
        if ($request->school_class_id) {
            $query->where('school_class_id', $request->school_class_id);
        }
        if ($request->academic_year_id) {
            $query->where('academic_year_id', $request->academic_year_id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'fee_category_id' => 'required|exists:fee_categories,id',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:monthly,quarterly,annual,one_time',
        ]);

        return response()->json(FeeStructure::create($data)->load('schoolClass', 'feeCategory'), 201);
    }

    public function update(Request $request, FeeStructure $feeStructure)
    {
        $data = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'frequency' => 'sometimes|in:monthly,quarterly,annual,one_time',
        ]);
        $feeStructure->update($data);

        return response()->json($feeStructure);
    }

    public function destroy(FeeStructure $feeStructure)
    {
        $feeStructure->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
