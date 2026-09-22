<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\ExamTypeController;
use App\Http\Controllers\Api\FeeCategoryController;
use App\Http\Controllers\Api\FeeInvoiceController;
use App\Http\Controllers\Api\FeePaymentController;
use App\Http\Controllers\Api\FeeStructureController;
use App\Http\Controllers\Api\MarkController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\ParentLinkController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\ProfilePhotoController;
use App\Http\Controllers\Api\ReportCardController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherAssignmentController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// ---- Public ----
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
Route::post('/contact', [EnquiryController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('notices', [NoticeController::class, 'index']);
    Route::get('portal/my-timetable', [TimetableController::class, 'mine']);

    // ---- Super Admin: academic setup ----
    Route::middleware('role:super_admin')->prefix('super-admin')->group(function () {
        Route::apiResource('academic-years', AcademicYearController::class)->except(['show']);
        Route::apiResource('school-classes', SchoolClassController::class)->except(['show']);
        Route::post('school-classes/{schoolClass}/subjects', [SchoolClassController::class, 'syncSubjects']);
        Route::apiResource('sections', SectionController::class)->except(['show']);
        Route::apiResource('subjects', SubjectController::class)->except(['show']);

        Route::apiResource('exam-types', ExamTypeController::class)->except(['show']);
        Route::apiResource('exams', ExamController::class)->except(['show']);
        Route::post('exams/{exam}/subjects', [ExamController::class, 'addSubject']);

        Route::post('report-cards/generate', [ReportCardController::class, 'generate']);
        Route::get('analytics', [AnalyticsController::class, 'schoolOverview']);
    });

    // ---- Admin: people management ----
    Route::middleware('role:admin,super_admin')->prefix('admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        Route::post('users/{user}/photo', [ProfilePhotoController::class, 'upload']);
        Route::delete('users/{user}/photo', [ProfilePhotoController::class, 'destroy']);

        Route::apiResource('students', StudentController::class)->except(['show']);
        Route::get('students/{student}', [StudentController::class, 'show']);
        Route::post('students/{student}/parents', [ParentLinkController::class, 'store']);
        Route::delete('students/{student}/parents/{parent}', [ParentLinkController::class, 'destroy']);
        Route::get('parents/{parent}/children', [ParentLinkController::class, 'children']);

        Route::get('teacher-assignments', [TeacherAssignmentController::class, 'index']);
        Route::post('teacher-assignments', [TeacherAssignmentController::class, 'store']);
        Route::delete('teacher-assignments/{teacherSubjectClass}', [TeacherAssignmentController::class, 'destroy']);

        Route::get('report-cards', [ReportCardController::class, 'index']);

        // ---- Fees ----
        Route::apiResource('fee-categories', FeeCategoryController::class)->except(['show']);
        Route::apiResource('fee-structures', FeeStructureController::class)->except(['show']);
        Route::get('fee-invoices', [FeeInvoiceController::class, 'index']);
        Route::post('fee-invoices/generate', [FeeInvoiceController::class, 'generate']);
        Route::delete('fee-invoices/{feeInvoice}', [FeeInvoiceController::class, 'destroy']);
        Route::post('fee-invoices/{feeInvoice}/payments', [FeePaymentController::class, 'store']);
        Route::delete('fee-payments/{feePayment}', [FeePaymentController::class, 'destroy']);

        Route::post('notices', [NoticeController::class, 'store']);
        Route::delete('notices/{notice}', [NoticeController::class, 'destroy']);
        Route::get('timetable', [TimetableController::class, 'index']);
        Route::post('timetable', [TimetableController::class, 'store']);
        Route::delete('timetable/{timetable}', [TimetableController::class, 'destroy']);
        Route::get('analytics', [AnalyticsController::class, 'classOverview']);
        Route::get('enquiries', [EnquiryController::class, 'index']);
        Route::put('enquiries/{enquiry}', [EnquiryController::class, 'update']);
    });

    // ---- Teacher: classroom ----
    Route::middleware('role:teacher,admin,super_admin')->prefix('teacher')->group(function () {
        Route::get('my-assignments', [TeacherAssignmentController::class, 'myAssignments']);
        Route::get('students', [StudentController::class, 'index']);
        Route::post('attendance/bulk', [AttendanceController::class, 'bulkStore']);

        Route::get('exams', [ExamController::class, 'index']);
        Route::get('marks/{examSubject}', [MarkController::class, 'forExamSubject']);
        Route::post('marks/bulk', [MarkController::class, 'bulkStore']);
        Route::get('analytics', [AnalyticsController::class, 'teacherOverview']);
    });

    // ---- Student / Parent ----
    Route::middleware('role:student,parent')->prefix('portal')->group(function () {
        Route::get('my-attendance', [AttendanceController::class, 'mine']);
        Route::get('my-marks', [MarkController::class, 'mine']);
        Route::get('my-report-cards', [ReportCardController::class, 'mine']);
        Route::get('my-fees', [FeePaymentController::class, 'mine']);
    });

    // ---- Admin/teacher lookup of one student's attendance ----
    Route::middleware('role:teacher,admin,super_admin')->group(function () {
        Route::get('attendance/{student}', [AttendanceController::class, 'forStudent']);
    });

    // Any authenticated role can hit this; authorization is checked inside the controller
    // (admin/teacher: any; student: own only; parent: their children only).
    Route::get('report-cards/{reportCard}/download', [ReportCardController::class, 'download']);
});
