<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExampleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Lecturer Routes
    Route::prefix('lecturer')->group(function () {
        Route::get('/profile', [\App\Http\Controllers\Api\LecturerController::class, 'getProfile']);
        Route::put('/profile', [\App\Http\Controllers\Api\LecturerController::class, 'updateProfile']);
        Route::get('/applicants', [\App\Http\Controllers\Api\LecturerController::class, 'getApplicants']);
        Route::post('/applicants/{id}/decide', [\App\Http\Controllers\Api\LecturerController::class, 'updateApplicantStatus']);
        Route::post('/quota-request', [\App\Http\Controllers\Api\LecturerController::class, 'requestQuota']);
    });

    // Student Routes
    Route::prefix('student')->group(function () {
        Route::get('/profile', [\App\Http\Controllers\Api\StudentController::class, 'getProfile']);
        Route::get('/lecturers', [\App\Http\Controllers\Api\StudentController::class, 'getLecturers']);
        Route::post('/submissions', [\App\Http\Controllers\Api\StudentController::class, 'storeSubmission']);
        Route::get('/submission', [\App\Http\Controllers\Api\StudentController::class, 'getSubmission']);
    });

    // Head of Study Program Routes
    Route::prefix('head')->group(function () {
        Route::get('/quota-requests', [\App\Http\Controllers\Api\HeadController::class, 'getQuotaRequests']);
        Route::post('/quota-requests/{id}/decide', [\App\Http\Controllers\Api\HeadController::class, 'decideQuotaRequest']);
        Route::get('/distribution', [\App\Http\Controllers\Api\HeadController::class, 'getStudentDistribution']);
    });
});

// Example API Routes
Route::prefix('v1')->group(function () {
    // Example CRUD endpoints
    Route::get('/items', [ExampleController::class, 'index']);
    Route::get('/items/{id}', [ExampleController::class, 'show']);
    Route::post('/items', [ExampleController::class, 'store']);
    Route::put('/items/{id}', [ExampleController::class, 'update']);
    Route::delete('/items/{id}', [ExampleController::class, 'destroy']);

    // Search endpoint
    Route::get('/search', [ExampleController::class, 'search']);
});

// Public API endpoints (no authentication required)
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toISOString()
    ]);
});
