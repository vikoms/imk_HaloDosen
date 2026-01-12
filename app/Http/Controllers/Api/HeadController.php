<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\QuotaRequest;
use App\Models\LecturerProfile;
use App\Models\StudentProfile;
use App\Models\Submission;
use Illuminate\Support\Facades\DB;

class HeadController extends Controller
{
    /**
     * Get all pending quota requests.
     */
    public function getQuotaRequests()
    {
        $requests = QuotaRequest::with(['lecturer.user'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                // Calculate current filled quota for context
                $approvedCount = $request->lecturer->submissions()->where('status', 'approved')->count();

                return [
                    'id' => $request->id,
                    'lecturer_name' => $request->lecturer->user->name,
                    'nidn' => $request->lecturer->nidn,
                    'current_quota' => $request->lecturer->current_quota, // This is the quota BEFORE the request
                    'filled_quota' => $approvedCount,
                    'requested_quota' => $request->requested_quota,
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    /**
     * Approve or reject a quota request.
     */
    public function decideQuotaRequest(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $quotaRequest = QuotaRequest::find($id);

        if (!$quotaRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Quota request not found'
            ], 404);
        }

        if ($quotaRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'This request has already been processed'
            ], 400);
        }

        DB::transaction(function () use ($quotaRequest, $request) {
            $quotaRequest->status = $request->status;
            $quotaRequest->save();

            if ($request->status === 'approved') {
                $lecturer = $quotaRequest->lecturer;
                $lecturer->current_quota = $quotaRequest->requested_quota;
                $lecturer->save();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Quota request ' . $request->status,
        ]);
    }

    /**
     * Get student distribution statistics.
     */
    public function getStudentDistribution(Request $request)
    {
        // Total Students
        $totalStudents = StudentProfile::count();

        // Students with Approved Topic
        $studentsWithTopic = Submission::where('status', 'approved')->count();

        // Students without Topic (roughly)
        $studentsWithoutTopic = $totalStudents - $studentsWithTopic;

        // Student Distribution
        $unassignedStudentsList = StudentProfile::with('user')
            ->whereDoesntHave('submissions', function ($q) {
                $q->where('status', 'approved');
            })
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'nim' => $student->nim,
                    'name' => $student->user->name
                ];
            });

        // Lecturer Distribution
        $lecturers = LecturerProfile::with(['user', 'submissions' => function ($q) {
            $q->where('status', 'approved');
        }])->get()->map(function ($lecturer) {
            $filled = $lecturer->submissions->count();
            return [
                'id' => $lecturer->id,
                'name' => $lecturer->user->name,
                'nidn' => $lecturer->nidn, // Added NIDN
                'quota' => $lecturer->current_quota,
                'filled' => $filled,
                'available' => max(0, $lecturer->current_quota - $filled),
                'percentage' => $lecturer->current_quota > 0 ? round(($filled / $lecturer->current_quota) * 100) : 0
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_students' => $totalStudents,
                    'with_topic' => $studentsWithTopic,
                    'without_topic' => $studentsWithoutTopic,
                ],
                'lecturers' => $lecturers,
                'unassigned_students' => $unassignedStudentsList
            ]
        ]);
    }
}
