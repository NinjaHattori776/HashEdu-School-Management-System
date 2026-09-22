import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable } from '../../components/ui';

export default function Analytics({ endpoint = '/super-admin/analytics' }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get(endpoint).then((res) => setData(res.data)).catch(() => setError('Failed to load analytics.')).finally(() => setLoading(false));
    }, [endpoint]);

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading analytics...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;
    const hasFullStats = data.total_students !== undefined;

    return <><PageHeader title="Analytics" subtitle="School-wide performance at a glance" /><div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">{hasFullStats && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"><StatCard label="Total students" value={data.total_students} /><StatCard label="Attendance rate" value={`${data.attendance_rate}%`} /><StatCard label="Pass rate" value={`${data.pass_rate}%`} /><StatCard label="Fee due" value={`$${data.total_fee_due}`} /><StatCard label="Fee collected" value={`$${data.total_fee_collected}`} /><StatCard label="Collection rate" value={`${data.fee_collection_rate}%`} /></div>}<Panel title="Attendance by Class"><LedgerTable columns={['Class', 'Students', 'Attendance Rate']}>{data.by_class.map((c) => <tr key={c.class} className="border-b last:border-0"><td className="py-2 pr-4">{c.class}</td><td className="py-2 pr-4">{c.students}</td><td className="py-2 pr-4">{c.attendance_rate !== null ? `${c.attendance_rate}%` : '—'}</td></tr>)}</LedgerTable></Panel></div></>;
}
