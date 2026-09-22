<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = ['exam_type_id', 'school_class_id', 'academic_year_id', 'name', 'start_date', 'end_date'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];

    public function examType() { return $this->belongsTo(ExamType::class); }
    public function schoolClass() { return $this->belongsTo(SchoolClass::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function examSubjects() { return $this->hasMany(ExamSubject::class); }
    public function reportCards() { return $this->hasMany(ReportCard::class); }
}
