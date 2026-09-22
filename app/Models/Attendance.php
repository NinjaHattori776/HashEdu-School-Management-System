<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = ['student_id', 'school_class_id', 'section_id', 'date', 'status', 'marked_by', 'remarks'];
    protected $casts = ['date' => 'date'];

    public function student() { return $this->belongsTo(Student::class); }
    public function markedBy() { return $this->belongsTo(User::class, 'marked_by'); }
}
