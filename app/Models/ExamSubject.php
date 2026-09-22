<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamSubject extends Model
{
    protected $fillable = ['exam_id', 'subject_id', 'max_marks', 'pass_marks', 'exam_date'];
    protected $casts = ['exam_date' => 'date'];

    public function exam() { return $this->belongsTo(Exam::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function marks() { return $this->hasMany(Mark::class); }
}
