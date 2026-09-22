<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class ParentLinkController extends Controller
{
    // POST /api/admin/students/{student}/parents  { parent_user_id }
    public function store(Request $request, Student $student)
    {
        $data = $request->validate([
            'parent_user_id' => 'required|exists:users,id',
        ]);

        $parent = User::findOrFail($data['parent_user_id']);
        if ($parent->role !== 'parent') {
            return response()->json(['message' => 'That user is not a parent-role account.'], 422);
        }

        $student->parents()->syncWithoutDetaching([$parent->id]);
        return response()->json($student->load('parents'));
    }

    public function destroy(Student $student, User $parent)
    {
        $student->parents()->detach($parent->id);
        return response()->json(['message' => 'Unlinked']);
    }

    // GET /api/admin/parents/{parent}/children — which students this parent account is linked to
    public function children(User $parent)
    {
        return response()->json($parent->children()->with('user:id,name')->get());
    }
}
