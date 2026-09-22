<?php
// Add these routes inside the existing `Route::middleware('role:admin,super_admin')->prefix('admin')->group(function () { ... });`
// block in your routes/api.php. If that block doesn't exist yet, create it at the
// same level as the super-admin group.

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherAssignmentController;
use App\Http\Controllers\Api\ParentLinkController;

// Route::middleware('role:admin,super_admin')->prefix('admin')->group(function () {
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    Route::apiResource('students', StudentController::class)->except(['show']);
    Route::get('students/{student}', [StudentController::class, 'show']);
    Route::post('students/{student}/parents', [ParentLinkController::class, 'store']);
    Route::delete('students/{student}/parents/{parent}', [ParentLinkController::class, 'destroy']);

    Route::get('teacher-assignments', [TeacherAssignmentController::class, 'index']);
    Route::post('teacher-assignments', [TeacherAssignmentController::class, 'store']);
    Route::delete('teacher-assignments/{teacherSubjectClass}', [TeacherAssignmentController::class, 'destroy']);
// });
