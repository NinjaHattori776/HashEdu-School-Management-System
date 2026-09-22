<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\ReportCard;
use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportCardController extends Controller
{
    // POST /api/super-admin/report-cards/generate  { school_class_id, exam_id }
    // Computes every student's percentage for this exam, ranks the class, and
    // generates a PDF per student. Re-running this for the same exam overwrites
    // each student's report card (so you can regenerate after fixing marks).
    public function generate(Request $request)
    {
        $data = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'exam_id' => 'required|exists:exams,id',
        ]);

        $exam = Exam::with('examSubjects.subject')->findOrFail($data['exam_id']);
        $students = Student::where('school_class_id', $data['school_class_id'])
            ->with('user:id,name')
            ->get();

        $maxTotal = $exam->examSubjects->sum('max_marks');

        // First pass: compute each student's percentage
        $results = $students->map(function ($student) use ($exam, $maxTotal) {
            $marks = Mark::whereIn('exam_subject_id', $exam->examSubjects->pluck('id'))
                ->where('student_id', $student->id)
                ->get()
                ->keyBy('exam_subject_id');

            $obtainedTotal = $exam->examSubjects->sum(function ($es) use ($marks) {
                return $marks->get($es->id)?->marks_obtained ?? 0;
            });

            $percentage = $maxTotal > 0 ? round(($obtainedTotal / $maxTotal) * 100, 2) : 0;

            return [
                'student' => $student,
                'obtained_total' => $obtainedTotal,
                'max_total' => $maxTotal,
                'percentage' => $percentage,
                'marks' => $marks,
            ];
        });

        // Rank by percentage descending
        $ranked = $results->sortByDesc('percentage')->values();
        $rankByStudentId = [];
        foreach ($ranked as $index => $r) {
            $rankByStudentId[$r['student']->id] = $index + 1;
        }

        $reportCards = [];

        foreach ($results as $r) {
            $grade = $this->gradeFor($r['percentage']);
            $rank = $rankByStudentId[$r['student']->id];

            $reportCard = ReportCard::updateOrCreate(
                ['student_id' => $r['student']->id, 'exam_id' => $exam->id],
                [
                    'academic_year_id' => $exam->academic_year_id,
                    'overall_percentage' => $r['percentage'],
                    'overall_grade' => $grade,
                    'class_rank' => $rank,
                    'generated_at' => now(),
                ]
            );

            $filePath = "report_cards/{$reportCard->id}.pdf";
            $pdf = Pdf::loadView('report-card', [
                'student' => $r['student'],
                'exam' => $exam,
                'percentage' => $r['percentage'],
                'grade' => $grade,
                'rank' => $rank,
                'totalStudents' => $results->count(),
                'obtainedTotal' => $r['obtained_total'],
                'maxTotal' => $r['max_total'],
                'subjectRows' => $exam->examSubjects->map(function ($es) use ($r) {
                    return [
                        'subject' => $es->subject->name,
                        'obtained' => $r['marks']->get($es->id)?->marks_obtained ?? '—',
                        'max' => $es->max_marks,
                    ];
                }),
            ]);
            Storage::disk('local')->put($filePath, $pdf->output());

            $reportCard->update(['file_path' => $filePath]);
            $reportCards[] = $reportCard->load('student.user');
        }

        return response()->json($reportCards);
    }

    private function gradeFor(float $percentage): string
    {
        return match (true) {
            $percentage >= 90 => 'A+',
            $percentage >= 80 => 'A',
            $percentage >= 70 => 'B',
            $percentage >= 60 => 'C',
            $percentage >= 50 => 'D',
            $percentage >= 35 => 'E',
            default => 'F',
        };
    }

    // GET /api/admin/report-cards?school_class_id=&exam_id=
    public function index(Request $request)
    {
        $query = ReportCard::with('student.user', 'exam');
        if ($request->exam_id) {
            $query->where('exam_id', $request->exam_id);
        }
        if ($request->school_class_id) {
            $query->whereHas('student', fn ($q) => $q->where('school_class_id', $request->school_class_id));
        }

        return $query->orderBy('class_rank')->get();
    }

    // GET /api/report-cards/{reportCard}/download
    public function download(Request $request, ReportCard $reportCard)
    {
        $user = $request->user();
        $student = $reportCard->student;

        $allowed = in_array($user->role, ['admin', 'super_admin', 'teacher'])
            || ($user->role === 'student' && $user->studentProfile?->id === $student->id)
            || ($user->role === 'parent' && $user->children->pluck('id')->contains($student->id));

        if (! $allowed) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (! $reportCard->file_path || ! Storage::disk('local')->exists($reportCard->file_path)) {
            return response()->json(['message' => 'Report card file not found.'], 404);
        }

        return Storage::disk('local')->download($reportCard->file_path, "report-card-{$student->admission_number}.pdf");
    }

    // GET /api/portal/my-report-cards
    public function mine(Request $request)
    {
        $user = $request->user();
        $students = $user->role === 'student'
            ? collect([$user->studentProfile])->filter()
            : $user->children;

        $result = $students->map(function ($student) {
            return [
                'student' => ['id' => $student->id, 'name' => $student->user->name ?? ''],
                'report_cards' => ReportCard::where('student_id', $student->id)
                    ->with('exam')
                    ->orderByDesc('generated_at')
                    ->get(),
            ];
        });

        return response()->json($result->values());
    }
}
