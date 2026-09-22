<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    // GET /api/notices — every authenticated role can read, scoped to what's relevant to them
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Notice::with('publisher:id,name', 'schoolClass:id,name')->orderByDesc('published_at');

        if (in_array($user->role, ['admin', 'super_admin'])) {
            return $query->get(); // admins see everything
        }

        $audienceMap = ['teacher' => 'teachers', 'student' => 'students', 'parent' => 'parents'];
        $audience = $audienceMap[$user->role] ?? null;

        $query->where(function ($q) use ($audience) {
            $q->where('audience', 'all');
            if ($audience) {
                $q->orWhere('audience', $audience);
            }
        });

        // Students/parents also see notices targeted at their specific class
        if ($user->role === 'student' && $user->studentProfile) {
            $query->orWhere(fn ($q) => $q->where('audience', 'class')->where('school_class_id', $user->studentProfile->school_class_id));
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:200',
            'body' => 'required|string',
            'audience' => 'required|in:all,students,teachers,parents,class',
            'school_class_id' => 'required_if:audience,class|nullable|exists:school_classes,id',
        ]);

        $notice = Notice::create($data + [
            'published_by' => $request->user()->id,
            'published_at' => now(),
        ]);

        return response()->json($notice->load('publisher', 'schoolClass'), 201);
    }

    public function destroy(Notice $notice)
    {
        $notice->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
