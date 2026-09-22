import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, LedgerTable } from '../../components/ui';

const DAY_LABEL = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };

export default function MyTimetable() {
    const [entries, setEntries] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
    useEffect(() => { client.get('/portal/my-timetable').then((res) => setEntries(res.data)).catch(() => setError('Failed to load timetable.')).finally(() => setLoading(false)); }, []);
    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading timetable...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;
    const byDay = entries.reduce((acc, e) => { (acc[e.day_of_week] = acc[e.day_of_week] || []).push(e); return acc; }, {});
    return <><PageHeader title="Timetable" subtitle="Your weekly schedule" /><div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">{Object.keys(byDay).length === 0 && <p style={{ color: '#6B7280' }}>No timetable entries yet.</p>}{Object.entries(byDay).map(([day, periods]) => <Panel key={day} title={DAY_LABEL[day]}><LedgerTable columns={['Time', 'Subject', 'With']}>{periods.map((p) => <tr key={p.id} className="border-b last:border-0"><td className="py-2 pr-4">{p.start_time} – {p.end_time}</td><td className="py-2 pr-4">{p.subject?.name}</td><td className="py-2 pr-4">{p.teacher?.name || p.school_class?.name}</td></tr>)}</LedgerTable></Panel>)}</div></>;
}
