import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable } from '../../components/ui';

const STATUS_COLOR = { present: '#2F7D5C', absent: '#B3452D', late: '#B8860B', leave: '#6B7280' };

function ChildAttendance({ entry }) {
    const { student, attendance } = entry;
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const rate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;

    return (
        <Panel title={student.name}>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <StatCard label="Days recorded" value={attendance.length} />
                <StatCard label="Present" value={presentCount} />
                <StatCard label="Attendance rate" value={`${rate}%`} />
            </div>
            <LedgerTable columns={['Date', 'Status', 'Remarks']}>
                {attendance.map((a) => (
                    <tr key={a.id} className="border-b last:border-0" style={{ borderColor: '#F0EEE7' }}>
                        <td className="py-2 pr-4">{a.date}</td>
                        <td className="py-2 pr-4 capitalize" style={{ color: STATUS_COLOR[a.status] }}>{a.status}</td>
                        <td className="py-2 pr-4" style={{ color: '#6B7280' }}>{a.remarks || '—'}</td>
                    </tr>
                ))}
                {attendance.length === 0 && (
                    <tr><td colSpan="3" className="py-6 text-center" style={{ color: '#6B7280' }}>No attendance recorded yet.</td></tr>
                )}
            </LedgerTable>
        </Panel>
    );
}

export default function MyAttendance() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/portal/my-attendance')
            .then((res) => setEntries(res.data))
            .catch(() => setError('Failed to load attendance.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading attendance...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Attendance" subtitle="Day-by-day attendance record" />
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {entries.length === 0 && (
                    <p style={{ color: '#6B7280' }}>No student record linked to this account yet.</p>
                )}
                {entries.map((entry) => (
                    <ChildAttendance key={entry.student.id} entry={entry} />
                ))}
            </div>
        </>
    );
}
