<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// Manages non-student users: teachers, admins, parents.
// (Students are created via StudentController, which makes both the User and
// the Student profile together in one request.)
class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->role) {
            $query->where('role', $request->role);
        }
        return $query->orderBy('name')->get(['id', 'name', 'email', 'role', 'phone', 'status', 'profile_photo']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,teacher,parent',
            'phone' => 'nullable|string|max:30',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['status'] = 'active';

        $user = User::create($data);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'phone', 'status']), 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:30',
            'status' => 'sometimes|in:active,inactive,suspended',
        ]);

        $user->update($data);
        return response()->json($user->only(['id', 'name', 'email', 'role', 'phone', 'status']));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
