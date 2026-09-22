<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    protected $fillable = ['school_class_id', 'academic_year_id', 'fee_category_id', 'amount', 'frequency'];

    public function schoolClass() { return $this->belongsTo(SchoolClass::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function feeCategory() { return $this->belongsTo(FeeCategory::class); }
    public function invoices() { return $this->hasMany(FeeInvoice::class); }
}
