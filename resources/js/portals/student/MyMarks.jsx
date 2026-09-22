import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, LedgerTable } from '../../components/ui';

function ChildMarks({ entry }) {
    const { student, exams } = entry;
    return (
        <Panel title={student.name}>
            {exams.length === 0 && (
                <p className="text-sm" style={{ color: '#6B7280' }}>No marks recorded yet.</p>
            )}
            {exams.map((exam) => (
                <div key={exam.exam_name} className="mb-5 last:mb-0">
                    <div className="text-sm font-medium mb-2">{exam.exam_name}</div>
                    <LedgerTable columns={['Subject', 'Marks']}>
                        {exam.subjects.map((s, i) => (
                            <tr key={i} className="border-b last:border-0" style={{ borderColor: '#F0EEE7' }}>
                                <td className="py-2 pr-4">{s.subject}</td>
                                <td className="py-2 pr-4">{s.marks_obtained ?? '—'} / {s.max_marks}</td>
                            </tr>
                        ))}
                    </LedgerTable>
                </div>
            ))}
        </Panel>
    );
}

export default function MyMarks() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/portal/my-marks')
            .then((res) => setEntries(res.data))
            .catch(() => setError('Failed to load marks.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading marks...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Marks" subtitle="Results by exam and subject" />
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {entries.length === 0 && (
                    <p style={{ color: '#6B7280' }}>No student record linked to this account yet.</p>
                )}
                {entries.map((entry) => (
                    <ChildMarks key={entry.student.id} entry={entry} />
                ))}
            </div>
        </>
    );
}
