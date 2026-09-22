<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\Request;

class EnquiryController extends Controller
{
    // POST /api/contact — public, no auth
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string',
        ]);

        Enquiry::create($data + ['status' => 'new']);

        return response()->json(['message' => "Thanks — we'll be in touch soon."], 201);
    }

    // GET /api/admin/enquiries — admin view of submissions
    public function index()
    {
        return Enquiry::orderByDesc('created_at')->get();
    }

    public function update(Request $request, Enquiry $enquiry)
    {
        $data = $request->validate(['status' => 'required|in:new,contacted,closed']);
        $enquiry->update($data);

        return response()->json($enquiry);
    }
}
