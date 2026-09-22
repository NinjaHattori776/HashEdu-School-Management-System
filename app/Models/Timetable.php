<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'school_class_id', 'section_id', 'subject_id', 'teacher_user_id',
        'academic_year_id', 'day_of_week', 'start_time', 'end_time',
    ];

    public function schoolClass() { return $this->belongsTo(SchoolClass::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function teacher() { return $this->belongsTo(User::class, 'teacher_user_id'); }
}
