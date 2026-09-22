<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeCategory extends Model
{
    protected $fillable = ['name'];

    public function feeStructures() { return $this->hasMany(FeeStructure::class); }
}
