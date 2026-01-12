<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LecturerProfile;
use App\Models\QuotaRequest;
use App\Models\Skill;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LecturerController extends Controller
{
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $lecturer = LecturerProfile::where('user_id', $user->id)->with('skills')->first();

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer profile not found'], 404);
        }

        // Calculate quota
        $filledQuota = Submission::where('lecturer_profile_id', $lecturer->id)
            ->where('status', 'approved')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => $lecturer,
                'user' => $user,
                'quota_usage' => [
                    'total' => $lecturer->current_quota,
                    'filled' => $filledQuota,
                    'remaining' => $lecturer->current_quota - $filledQuota
                ]
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'skills' => 'array',
            'skills.*' => 'string',
            'is_active' => 'boolean'
        ]);

        $user = $request->user();
        $lecturer = LecturerProfile::where('user_id', $user->id)->first();

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer profile not found'], 404);
        }

        // Update active status
        if ($request->has('is_active')) {
            $lecturer->update(['is_active' => $request->is_active]);
        }

        // Update skills
        if ($request->has('skills')) {
            $skillIds = [];
            foreach ($request->skills as $skillName) {
                $slug = Str::slug($skillName);
                $skill = Skill::firstOrCreate(
                    ['slug' => $slug],
                    ['name' => $skillName]
                );
                $skillIds[] = $skill->id;
            }
            $lecturer->skills()->sync($skillIds);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $lecturer->load('skills')
        ]);
    }

    public function getApplicants(Request $request)
    {
        $user = $request->user();
        $lecturer = LecturerProfile::where('user_id', $user->id)->first();

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer profile not found'], 404);
        }

        $submissions = Submission::where('lecturer_profile_id', $lecturer->id)
            ->with(['student.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }

    public function updateApplicantStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|string|nullable'
        ]);

        $user = $request->user();
        $lecturer = LecturerProfile::where('user_id', $user->id)->first();

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer profile not found'], 404);
        }

        $submission = Submission::where('id', $id)
            ->where('lecturer_profile_id', $lecturer->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        if ($request->status === 'approved') {
            // Check quota
            $filledQuota = Submission::where('lecturer_profile_id', $lecturer->id)
                ->where('status', 'approved')
                ->count();

            if ($filledQuota >= $lecturer->current_quota) {
                return response()->json(['message' => 'Quota is full'], 400);
            }
        }

        $submission->update([
            'status' => $request->status,
            'rejection_reason' => $request->rejection_reason,
            'decided_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Submission status updated',
            'data' => $submission
        ]);
    }

    public function requestQuota(Request $request)
    {
        $request->validate([
            'requested_quota' => 'required|integer|min:1'
        ]);

        $user = $request->user();
        $lecturer = LecturerProfile::where('user_id', $user->id)->first();

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer profile not found'], 404);
        }

        $quotaRequest = QuotaRequest::create([
            'lecturer_profile_id' => $lecturer->id,
            'requested_quota' => $request->requested_quota,
            'previous_quota' => $lecturer->current_quota,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Quota request submitted successfully',
            'data' => $quotaRequest
        ]);
    }
}
