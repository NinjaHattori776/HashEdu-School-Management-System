<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    protected $table = 'school_classes';
    protected $fillable = ['name', 'numeric_level'];

    public function sections() { return $this->hasMany(Section::class); }
    public function subjects() { return $this->belongsToMany(Subject::class, 'class_subject'); }
    public function students() { return $this->hasMany(Student::class); }
    public function feeStructures() { return $this->hasMany(FeeStructure::class); }
}
