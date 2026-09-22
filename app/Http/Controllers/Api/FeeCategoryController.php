<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeCategory;
use Illuminate\Http\Request;

class FeeCategoryController extends Controller
{
    public function index()
    {
        return FeeCategory::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:100']);

        return response()->json(FeeCategory::create($data), 201);
    }

    public function update(Request $request, FeeCategory $feeCategory)
    {
        $data = $request->validate(['name' => 'required|string|max:100']);
        $feeCategory->update($data);

        return response()->json($feeCategory);
    }

    public function destroy(FeeCategory $feeCategory)
    {
        $feeCategory->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
