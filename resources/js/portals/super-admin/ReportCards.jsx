import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Select, Button } from '../../components/ui';

const GRADE_COLOR = { 'A+': '#2F7D5C', A: '#2F7D5C', B: '#2F7D5C', C: '#B8860B', D: '#B8860B', E: '#B3452D', F: '#B3452D' };

export default function ReportCards() {
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [reportCards, setReportCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    async function loadAll() {
        setLoading(true);
        try {
            const [c, e] = await Promise.all([
                client.get('/super-admin/school-classes'),
                client.get('/super-admin/exams'),
            ]);
            setClasses(c.data);
            setExams(e.data);
        } catch (err) {
            setError('Failed to load classes and exams.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadAll(); }, []);

    async function loadReportCards(classId, examId) {
        if (!classId || !examId) { setReportCards([]); return; }
        const res = await client.get('/admin/report-cards', { params: { school_class_id: classId, exam_id: examId } });
        setReportCards(res.data);
    }

    async function handleGenerate() {
        setGenerating(true);
        setError(null);
        try {
            await client.post('/super-admin/report-cards/generate', {
                school_class_id: selectedClass,
                exam_id: selectedExam,
            });
            loadReportCards(selectedClass, selectedExam);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate report cards.');
        } finally {
            setGenerating(false);
        }
    }

    async function handleDownload(reportCard) {
        const res = await client.get(`/report-cards/${reportCard.id}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-card-${reportCard.student?.admission_number || reportCard.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading...</div>;

    return (
        <>
            <PageHeader title="Report Cards" subtitle="Generate and download report cards for an exam" />
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <Panel title="Select class & exam">
                    {error && <p className="text-sm mb-3" style={{ color: '#B3452D' }}>{error}</p>}
                    <div className="flex gap-3 items-end flex-wrap">
                        <div className="w-56">
                            <label className="block text-xs mb-1" style={{ color: '#6B7280' }}>Class</label>
                            <Select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); loadReportCards(e.target.value, selectedExam); }}>
                                <option value="">Select class...</option>
                                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                        </div>
                        <div className="w-64">
                            <label className="block text-xs mb-1" style={{ color: '#6B7280' }}>Exam</label>
                            <Select value={selectedExam} onChange={(e) => { setSelectedExam(e.target.value); loadReportCards(selectedClass, e.target.value); }}>
                                <option value="">Select exam...</option>
                                {exams.filter((e) => !selectedClass || e.school_class_id === Number(selectedClass)).map((e) => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={!selectedClass || !selectedExam || generating}>
                            {generating ? 'Generating...' : 'Generate Report Cards'}
                        </Button>
                    </div>
                </Panel>

                {selectedClass && selectedExam && (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="Report cards" value={reportCards.length} />
                            <StatCard label="Class average" value={
                                reportCards.length
                                    ? `${(reportCards.reduce((sum, r) => sum + Number(r.overall_percentage), 0) / reportCards.length).toFixed(1)}%`
                                    : '—'
                            } />
                            <StatCard label="Top rank" value={reportCards.length ? '#1' : '—'} />
                        </div>

                        <Panel title="Results">
                            <LedgerTable columns={['Rank', 'Student', 'Percentage', 'Grade', '']}>
                                {reportCards.map((rc) => (
                                    <tr key={rc.id} className="border-b last:border-0" style={{ borderColor: '#F0EEE7' }}>
                                        <td className="py-2 pr-4">#{rc.class_rank}</td>
                                        <td className="py-2 pr-4">{rc.student?.user?.name}</td>
                                        <td className="py-2 pr-4">{rc.overall_percentage}%</td>
                                        <td className="py-2 pr-4" style={{ color: GRADE_COLOR[rc.overall_grade] || '#22262B' }}>{rc.overall_grade}</td>
                                        <td className="py-2 pr-4">
                                            <button onClick={() => handleDownload(rc)} className="text-xs underline" style={{ color: '#1B2A4A' }}>Download PDF</button>
                                        </td>
                                    </tr>
                                ))}
                                {reportCards.length === 0 && (
                                    <tr><td colSpan="5" className="py-6 text-center" style={{ color: '#6B7280' }}>
                                        No report cards generated yet for this exam. Click "Generate Report Cards" above.
                                    </td></tr>
                                )}
                            </LedgerTable>
                        </Panel>
                    </>
                )}
            </div>
        </>
    );
}
