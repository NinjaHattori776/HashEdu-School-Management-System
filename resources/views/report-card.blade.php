<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; color: #22262B; font-size: 13px; }
        h1 { font-size: 20px; margin-bottom: 0; }
        .muted { color: #6B7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #D8D5CB; padding: 8px; text-align: left; }
        th { background: #F7F6F3; }
        .summary { margin-top: 20px; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #F0EEE7; }
        .grade { font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Report Card</h1>
    <p class="muted">Springfield School Register</p>

    <table>
        <tr>
            <td><strong>Student</strong></td>
            <td>{{ $student->user->name ?? '' }}</td>
            <td><strong>Admission #</strong></td>
            <td>{{ $student->admission_number }}</td>
        </tr>
        <tr>
            <td><strong>Exam</strong></td>
            <td>{{ $exam->name }}</td>
            <td><strong>Class</strong></td>
            <td>{{ $exam->schoolClass->name ?? '' }}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr><th>Subject</th><th>Marks Obtained</th><th>Max Marks</th></tr>
        </thead>
        <tbody>
            @foreach ($subjectRows as $row)
                <tr>
                    <td>{{ $row['subject'] }}</td>
                    <td>{{ $row['obtained'] }}</td>
                    <td>{{ $row['max'] }}</td>
                </tr>
            @endforeach
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>{{ $obtainedTotal }}</strong></td>
                <td><strong>{{ $maxTotal }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-row"><span>Percentage</span><span>{{ $percentage }}%</span></div>
        <div class="summary-row"><span>Grade</span><span class="grade">{{ $grade }}</span></div>
        <div class="summary-row"><span>Class Rank</span><span>{{ $rank }} of {{ $totalStudents }}</span></div>
    </div>
</body>
</html>
