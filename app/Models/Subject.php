<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name', 'code', 'is_elective'];

    public function classes() { return $this->belongsToMany(SchoolClass::class, 'class_subject'); }
}
