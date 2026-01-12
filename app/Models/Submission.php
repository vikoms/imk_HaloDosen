<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'student_profile_id',
        'lecturer_profile_id',
        'title',
        'description',
        'status',
        'rejection_reason',
        'viewed_at',
        'decided_at',
    ];

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_profile_id');
    }

    public function lecturer()
    {
        return $this->belongsTo(LecturerProfile::class, 'lecturer_profile_id');
    }
}
