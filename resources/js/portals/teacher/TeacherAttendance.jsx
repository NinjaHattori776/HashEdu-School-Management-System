import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Select, Button } from '../../components/ui';

const STATUS_OPTIONS = ['present', 'absent', 'late', 'leave'];
const STATUS_COLOR = { present: '#2F7D5C', absent: '#B3452D', late: '#B8860B', leave: '#6B7280' };

export default function TeacherAttendance() {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [students, setStudents] = useState([]);
    const [statuses, setStatuses] = useState({}); // studentId -> status
    const [loading, setLoading] = useState(true);
    const [rosterLoading, setRosterLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        client.get('/teacher/my-assignments')
            .then((res) => setAssignments(res.data))
            .catch(() => setError('Failed to load your assignments.'))
            .finally(() => setLoading(false));
    }, []);

    // De-duplicate assignments down to distinct class+section combos for the picker
    const classSectionOptions = Object.values(
        assignments.reduce((acc, a) => {
            const key = `${a.school_class_id}-${a.section_id}`;
            if (!acc[key]) acc[key] = { key, school_class_id: a.school_class_id, section_id: a.section_id, label: `${a.school_class?.name} — ${a.section?.name}` };
            return acc;
        }, {})
    );

    async function loadRoster(key) {
        setSelectedAssignment(key);
        setSaved(false);
        const combo = classSectionOptions.find((c) => c.key === key);
        if (!combo) { setStudents([]); return; }
        setRosterLoading(true);
        try {
            const res = await client.get('/teacher/students', {
                params: { school_class_id: combo.school_class_id, section_id: combo.section_id },
            });
            setStudents(res.data);
            const initial = {};
            res.data.forEach((s) => { initial[s.id] = 'present'; });
            setStatuses(initial);
        } catch (err) {
            setError('Failed to load the class roster.');
        } finally {
            setRosterLoading(false);
        }
    }

    function setStatus(studentId, status) {
        setStatuses((prev) => ({ ...prev, [studentId]: status }));
    }

    async function handleSubmit() {
        const combo = classSectionOptions.find((c) => c.key === selectedAssignment);
        if (!combo) return;
        setSaved(false);
        try {
            await client.post('/teacher/attendance/bulk', {
                school_class_id: combo.school_class_id,
                section_id: combo.section_id,
                date,
                records: students.map((s) => ({ student_id: s.id, status: statuses[s.id] || 'present' })),
            });
            setSaved(true);
        } catch (err) {
            setError('Failed to save attendance.');
        }
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading your classes...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    const presentCount = Object.values(statuses).filter((s) => s === 'present').length;

    return (
        <>
            <PageHeader title="Attendance" subtitle="Mark attendance for one of your assigned classes" />
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <Panel title="Select class & date">
                    <div className="flex gap-3 items-end flex-wrap">
                        <div className="w-64">
                            <label className="block text-xs mb-1" style={{ color: '#6B7280' }}>Class & section</label>
                            <Select value={selectedAssignment} onChange={(e) => loadRoster(e.target.value)}>
                                <option value="">Select...</option>
                                {classSectionOptions.map((c) => (
                                    <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-44">
                            <label className="block text-xs mb-1" style={{ color: '#6B7280' }}>Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border px-3 py-2 text-sm w-full"
                                style={{ borderColor: '#D8D5CB' }}
                            />
                        </div>
                    </div>
                    {classSectionOptions.length === 0 && (
                        <p className="text-sm mt-3" style={{ color: '#6B7280' }}>
                            You have no class assignments yet — ask an admin to assign you to a subject and class first.
                        </p>
                    )}
                </Panel>

                {selectedAssignment && (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="Roster" value={students.length} />
                            <StatCard label="Marked present" value={presentCount} />
                            <StatCard label="Date" value={date} />
                        </div>

                        <Panel
                            title="Roster"
                            action={<Button onClick={handleSubmit} disabled={students.length === 0}>Save Attendance</Button>}
                        >
                            {saved && <p className="text-sm mb-3" style={{ color: '#2F7D5C' }}>Attendance saved.</p>}
                            {rosterLoading ? (
                                <p style={{ color: '#6B7280' }}>Loading roster...</p>
                            ) : (
                                <LedgerTable columns={['Admission #', 'Name', 'Status']}>
                                    {students.map((s) => (
                                        <tr key={s.id} className="border-b last:border-0" style={{ borderColor: '#F0EEE7' }}>
                                            <td className="py-2 pr-4">{s.admission_number}</td>
                                            <td className="py-2 pr-4">{s.user?.name}</td>
                                            <td className="py-2 pr-4">
                                                <div className="flex gap-1">
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => setStatus(s.id, opt)}
                                                            className="px-2.5 py-1 text-xs border capitalize"
                                                            style={{
                                                                borderColor: statuses[s.id] === opt ? STATUS_COLOR[opt] : '#D8D5CB',
                                                                color: statuses[s.id] === opt ? STATUS_COLOR[opt] : '#6B7280',
                                                                background: statuses[s.id] === opt ? `${STATUS_COLOR[opt]}14` : 'transparent',
                                                            }}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr><td colSpan="3" className="py-6 text-center" style={{ color: '#6B7280' }}>No students in this class/section.</td></tr>
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
