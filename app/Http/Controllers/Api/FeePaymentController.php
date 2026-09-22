<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use Illuminate\Http\Request;

class FeePaymentController extends Controller
{
    // POST /api/admin/fee-invoices/{feeInvoice}/payments
    public function store(Request $request, FeeInvoice $feeInvoice)
    {
        $data = $request->validate([
            'amount_paid' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:cash,card,bank_transfer,online,cheque',
            'transaction_reference' => 'nullable|string|max:100',
        ]);

        $payment = $feeInvoice->payments()->create($data + ['received_by' => $request->user()->id]);

        $totalPaid = $feeInvoice->payments()->sum('amount_paid');
        $feeInvoice->update([
            'status' => $totalPaid >= $feeInvoice->amount_due ? 'paid' : ($totalPaid > 0 ? 'partial' : 'pending'),
        ]);

        return response()->json($payment->load('receivedBy'), 201);
    }

    public function destroy(FeePayment $feePayment)
    {
        $invoice = $feePayment->invoice;
        $feePayment->delete();

        $totalPaid = $invoice->payments()->sum('amount_paid');
        $invoice->update([
            'status' => $totalPaid >= $invoice->amount_due ? 'paid' : ($totalPaid > 0 ? 'partial' : 'pending'),
        ]);

        return response()->json(['message' => 'Payment removed']);
    }

    // GET /api/portal/my-fees
    public function mine(Request $request)
    {
        $user = $request->user();
        $students = $user->role === 'student'
            ? collect([$user->studentProfile])->filter()
            : $user->children;

        $result = $students->map(function ($student) {
            return [
                'student' => ['id' => $student->id, 'name' => $student->user->name ?? ''],
                'invoices' => FeeInvoice::where('student_id', $student->id)
                    ->with('feeStructure.feeCategory', 'payments')
                    ->orderByDesc('due_date')
                    ->get(),
            ];
        });

        return response()->json($result->values());
    }
}
