import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, LedgerTable } from '../../components/ui';

export default function TeacherAnalytics() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/teacher/analytics').then((res) => setRows(res.data)).catch(() => setError('Failed to load analytics.')).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading analytics...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return <><PageHeader title="Analytics" subtitle="Class average per subject you teach" /><div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6"><Panel title="Subject Averages"><LedgerTable columns={['Subject', 'Class', 'Average Marks']}>{rows.map((r, i) => <tr key={i} className="border-b last:border-0"><td className="py-2 pr-4">{r.subject}</td><td className="py-2 pr-4">{r.class}</td><td className="py-2 pr-4">{r.average_marks ?? 'No marks yet'}</td></tr>)}{rows.length === 0 && <tr><td colSpan="3" className="py-6 text-center" style={{ color: '#6B7280' }}>No assignments yet.</td></tr>}</LedgerTable></Panel></div></>;
}
