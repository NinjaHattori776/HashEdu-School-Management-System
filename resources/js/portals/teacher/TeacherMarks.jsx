import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Button } from '../../components/ui';

export default function TeacherMarks() {
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [roster, setRoster] = useState([]);
    const [examSubjectMeta, setExamSubjectMeta] = useState(null);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [rosterLoading, setRosterLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        Promise.all([
            client.get('/teacher/my-assignments'),
            client.get('/teacher/exams'),
        ]).then(([a, e]) => {
            setAssignments(a.data);
            setExams(e.data);
        }).catch(() => setError('Failed to load your classes and exams.'))
          .finally(() => setLoading(false));
    }, []);

    const myClassIds = new Set(assignments.map((a) => a.school_class_id));
    const myExams = exams.filter((e) => myClassIds.has(e.school_class_id));
    const selectedExam = myExams.find((e) => e.id === Number(selectedExamId));
    const subjectOptions = selectedExam?.exam_subjects || [];

    async function loadRoster(examSubjectId) {
        setSelectedSubjectId(examSubjectId);
        setSaved(false);
        if (!examSubjectId) { setRoster([]); return; }
        setRosterLoading(true);
        try {
            const res = await client.get(`/teacher/marks/${examSubjectId}`);
            setExamSubjectMeta(res.data.exam_subject);
            setRoster(res.data.roster);
            const initial = {};
            res.data.roster.forEach((s) => { initial[s.student_id] = s.marks_obtained ?? ''; });
            setMarks(initial);
        } catch (err) {
            setError('Failed to load the roster for this subject.');
        } finally {
            setRosterLoading(false);
        }
    }

    async function handleSubmit() {
        try {
            await client.post('/teacher/marks/bulk', {
                exam_subject_id: selectedSubjectId,
                records: roster.map((s) => ({
                    student_id: s.student_id,
                    marks_obtained: marks[s.student_id] === '' ? null : marks[s.student_id],
                })),
            });
            setSaved(true);
        } catch (err) {
            setError('Failed to save marks.');
        }
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Marks Entry" subtitle="Enter marks for one subject of one exam" />
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <Panel title="Select exam & subject">
                    <div className="flex gap-3 flex-wrap">
                        <div className="w-64">
                            <label className="block text-xs mb-1" style={{ color: '#6B7280' }}>Exam</label>
                            <select
                                className="border px-3 py-2 text-sm w-full bg-white"
                                style={{ borderColor: '#D8D5CB' }}
                                value={selectedExamId}
                                onChange={(e) => { setSelectedExamId(e.target.value); loadRoster(''); }}
                            >
                                <option value="">Select exam...</option>
                                {myExams.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.school_class?.name}</option>)}
                            </select>
                        </div>
                        <div className="w-64">
                            <label className="block text-xs mb-1" style={{ color: '#6B7280' }}>Subject</label>
                            <select
                                className="border px-3 py-2 text-sm w-full bg-white"
                                style={{ borderColor: '#D8D5CB' }}
                                value={selectedSubjectId}
                                onChange={(e) => loadRoster(e.target.value)}
                                disabled={!selectedExamId}
                            >
                                <option value="">Select subject...</option>
                                {subjectOptions.map((es) => <option key={es.id} value={es.id}>{es.subject?.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {myExams.length === 0 && (
                        <p className="text-sm mt-3" style={{ color: '#6B7280' }}>
                            No exams found for your assigned classes yet — ask a super admin to create one.
                        </p>
                    )}
                </Panel>

                {selectedSubjectId && (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="Roster" value={roster.length} />
                            <StatCard label="Max marks" value={examSubjectMeta?.max_marks ?? '—'} />
                            <StatCard label="Pass marks" value={examSubjectMeta?.pass_marks ?? '—'} />
                        </div>

                        <Panel title="Enter Marks" action={<Button onClick={handleSubmit} disabled={roster.length === 0}>Save Marks</Button>}>
                            {saved && <p className="text-sm mb-3" style={{ color: '#2F7D5C' }}>Marks saved.</p>}
                            {rosterLoading ? (
                                <p style={{ color: '#6B7280' }}>Loading roster...</p>
                            ) : (
                                <LedgerTable columns={['Admission #', 'Name', `Marks (out of ${examSubjectMeta?.max_marks ?? '—'})`]}>
                                    {roster.map((s) => (
                                        <tr key={s.student_id} className="border-b last:border-0" style={{ borderColor: '#F0EEE7' }}>
                                            <td className="py-2 pr-4">{s.admission_number}</td>
                                            <td className="py-2 pr-4">{s.name}</td>
                                            <td className="py-2 pr-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={examSubjectMeta?.max_marks}
                                                    className="border px-2 py-1 text-sm w-24"
                                                    style={{ borderColor: '#D8D5CB' }}
                                                    value={marks[s.student_id] ?? ''}
                                                    onChange={(e) => setMarks({ ...marks, [s.student_id]: e.target.value })}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {roster.length === 0 && (
                                        <tr><td colSpan="3" className="py-6 text-center" style={{ color: '#6B7280' }}>No students in this class.</td></tr>
                                    )}
                                </LedgerTable>
                            )}
                        </Panel>
                    </>
                )}
            </div>
        </>
    );
}
