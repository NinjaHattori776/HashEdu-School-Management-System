<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = ['title', 'body', 'audience', 'school_class_id', 'published_by', 'published_at'];
    protected $casts = ['published_at' => 'datetime'];

    public function schoolClass() { return $this->belongsTo(SchoolClass::class); }
    public function publisher() { return $this->belongsTo(User::class, 'published_by'); }
}
