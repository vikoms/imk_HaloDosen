<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentProfile;
use App\Models\LecturerProfile;
use App\Models\Submission;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Get the authenticated student's profile.
     */
    public function getProfile()
    {
        $user = Auth::user();
        $studentProfile = StudentProfile::where('user_id', $user->id)->first();

        if (!$studentProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'profile' => $studentProfile
            ]
        ]);
    }

    /**
     * Get list of lecturers with their profiles and skills.
     */
    public function getLecturers(Request $request)
    {
        $query = LecturerProfile::with(['user', 'skills']);

        // Filter by name
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Filter by skill
        if ($request->has('skill')) {
            $skill = $request->skill;
            $query->whereHas('skills', function ($q) use ($skill) {
                $q->where('name', 'like', "%{$skill}%");
            });
        }

        $lecturers = $query->get()->map(function ($lecturer) {
            // Calculate available quota (simple version)
            // Ideally we should count approved submissions
            $approvedCount = $lecturer->submissions()->where('status', 'approved')->count();

            return [
                'id' => $lecturer->id,
                'name' => $lecturer->user->name,
                'nidn' => $lecturer->nidn,
                'skills' => $lecturer->skills,
                'quota' => $lecturer->current_quota,
                'filled' => $approvedCount,
                'available' => max(0, $lecturer->current_quota - $approvedCount)
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $lecturers
        ]);
    }

    /**
     * Submit a new thesis proposal.
     */
    public function storeSubmission(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lecturer_profile_id' => 'required|exists:lecturer_profiles,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $studentProfile = StudentProfile::where('user_id', $user->id)->first();

        if (!$studentProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found. Please complete your profile first.'
            ], 404);
        }

        // Check for existing pending or approved submissions
        $existingSubmission = Submission::where('student_profile_id', $studentProfile->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingSubmission) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a pending or approved submission.'
            ], 400);
        }

        // Check if lecturer quota is full
        $lecturer = LecturerProfile::find($request->lecturer_profile_id);
        $approvedCount = $lecturer->submissions()->where('status', 'approved')->count();

        if ($approvedCount >= $lecturer->current_quota) {
            return response()->json([
                'success' => false,
                'message' => 'Lecturer quota is full.'
            ], 400);
        }

        $submission = Submission::create([
            'student_profile_id' => $studentProfile->id,
            'lecturer_profile_id' => $request->lecturer_profile_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Submission created successfully',
            'data' => $submission
        ], 201);
    }

    /**
     * Get the student's current submission.
     */
    public function getSubmission()
    {
        $user = Auth::user();
        $studentProfile = StudentProfile::where('user_id', $user->id)->first();

        if (!$studentProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Student profile not found'
            ], 404);
        }

        // Get latest submission
        $submission = Submission::with(['lecturer.user'])
            ->where('student_profile_id', $studentProfile->id)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => $submission ? [
                'id' => $submission->id,
                'title' => $submission->title,
                'description' => $submission->description,
                'status' => $submission->status,
                'created_at' => $submission->created_at,
                'rejection_reason' => $submission->rejection_reason,
                'lecturer_name' => $submission->lecturer->user->name
            ] : null
        ]);
    }
}
