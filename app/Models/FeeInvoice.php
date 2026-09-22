<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeInvoice extends Model
{
    protected $fillable = ['student_id', 'fee_structure_id', 'academic_year_id', 'amount_due', 'due_date', 'status'];
    protected $casts = ['due_date' => 'date'];

    public function student() { return $this->belongsTo(Student::class); }
    public function feeStructure() { return $this->belongsTo(FeeStructure::class); }
    public function payments() { return $this->hasMany(FeePayment::class); }
}
