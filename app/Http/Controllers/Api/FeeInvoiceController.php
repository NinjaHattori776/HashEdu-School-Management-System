<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeInvoice;
use App\Models\FeeStructure;
use App\Models\Student;
use Illuminate\Http\Request;

class FeeInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = FeeInvoice::with('student.user', 'feeStructure.feeCategory', 'payments');
        if ($request->school_class_id) {
            $query->whereHas('student', fn ($q) => $q->where('school_class_id', $request->school_class_id));
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        return $query->orderByDesc('due_date')->get();
    }

    // POST /api/admin/fee-invoices/generate  { fee_structure_id, due_date }
    // Creates one invoice per student in that structure's class/year — skips
    // students who already have an invoice for this structure (safe to re-run).
    public function generate(Request $request)
    {
        $data = $request->validate([
            'fee_structure_id' => 'required|exists:fee_structures,id',
            'due_date' => 'required|date',
        ]);

        $structure = FeeStructure::findOrFail($data['fee_structure_id']);
        $students = Student::where('school_class_id', $structure->school_class_id)
            ->where('academic_year_id', $structure->academic_year_id)
            ->get();

        $created = [];
        foreach ($students as $student) {
            $invoice = FeeInvoice::firstOrCreate(
                ['student_id' => $student->id, 'fee_structure_id' => $structure->id],
                [
                    'academic_year_id' => $structure->academic_year_id,
                    'amount_due' => $structure->amount,
                    'due_date' => $data['due_date'],
                    'status' => 'pending',
                ]
            );
            $created[] = $invoice;
        }

        return response()->json(['message' => count($created).' invoice(s) processed.', 'invoices' => $created]);
    }

    public function destroy(FeeInvoice $feeInvoice)
    {
        $feeInvoice->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
