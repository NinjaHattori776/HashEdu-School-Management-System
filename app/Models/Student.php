<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id', 'admission_number', 'school_class_id', 'section_id', 'academic_year_id',
        'date_of_birth', 'gender', 'address', 'guardian_name', 'guardian_phone',
        'guardian_email', 'admission_date',
    ];
    protected $casts = ['date_of_birth' => 'date', 'admission_date' => 'date'];

    public function user() { return $this->belongsTo(User::class); }
    public function schoolClass() { return $this->belongsTo(SchoolClass::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function parents() { return $this->belongsToMany(User::class, 'parent_student', 'student_id', 'parent_user_id'); }
    public function attendances() { return $this->hasMany(Attendance::class); }
    public function marks() { return $this->hasMany(Mark::class); }
    public function reportCards() { return $this->hasMany(ReportCard::class); }
    public function feeInvoices() { return $this->hasMany(FeeInvoice::class); }
}
