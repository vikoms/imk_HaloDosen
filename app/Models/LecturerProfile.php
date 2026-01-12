<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LecturerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nidn',
        'current_quota',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'lecturer_skills');
    }

    public function quotaRequests()
    {
        return $this->hasMany(QuotaRequest::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'lecturer_profile_id');
    }
}
