<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotaRequest extends Model
{
    protected $fillable = [
        'lecturer_profile_id',
        'requested_quota',
        'previous_quota',
        'status',
        'admin_note',
    ];

    public function lecturer()
    {
        return $this->belongsTo(LecturerProfile::class, 'lecturer_profile_id');
    }
}
