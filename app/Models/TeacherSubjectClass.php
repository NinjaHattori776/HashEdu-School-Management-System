<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherSubjectClass extends Model
{
    protected $table = 'teacher_subject_class';

    protected $fillable = [
        'teacher_user_id',
        'subject_id',
        'school_class_id',
        'section_id',
        'academic_year_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_user_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}