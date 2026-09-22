<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    protected $fillable = ['exam_subject_id', 'student_id', 'marks_obtained', 'grade', 'remarks', 'entered_by'];

    public function examSubject() { return $this->belongsTo(ExamSubject::class); }
    public function student() { return $this->belongsTo(Student::class); }
    public function enteredBy() { return $this->belongsTo(User::class, 'entered_by'); }
}
