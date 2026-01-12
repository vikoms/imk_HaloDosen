<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'slug'];

    public function lecturers()
    {
        return $this->belongsToMany(LecturerProfile::class, 'lecturer_skills');
    }
}
