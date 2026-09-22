<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportCard extends Model
{
    protected $fillable = [
        'student_id', 'academic_year_id', 'exam_id', 'overall_percentage',
        'overall_grade', 'class_rank', 'file_path', 'generated_at',
    ];
    protected $casts = ['generated_at' => 'datetime'];

    public function student() { return $this->belongsTo(Student::class); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function exam() { return $this->belongsTo(Exam::class); }
}
