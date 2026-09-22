<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

// Optional photo upload for any user (student/teacher/parent/admin all share
// the `profile_photo` column on `users`, already present from the original
// scaffold). The system works fully without a photo — every screen shows an
// initials avatar (see ui.jsx's <Avatar>) when profile_photo is null.
class ProfilePhotoController extends Controller
{
    // POST /api/admin/users/{user}/photo — multipart/form-data, field name "photo"
    public function upload(Request $request, User $user)
    {
        $request->validate([
            'photo' => 'required|image|max:2048', // 2MB max
        ]);

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $path = $request->file('photo')->store('avatars', 'public');
        $user->update(['profile_photo' => $path]);

        return response()->json([
            'profile_photo' => $path,
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
            $user->update(['profile_photo' => null]);
        }

        return response()->json(['message' => 'Photo removed']);
    }
}
