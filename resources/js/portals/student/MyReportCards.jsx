import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, LedgerTable } from '../../components/ui';

const GRADE_COLOR = { 'A+': '#2F7D5C', A: '#2F7D5C', B: '#2F7D5C', C: '#B8860B', D: '#B8860B', E: '#B3452D', F: '#B3452D' };

function ChildReportCards({ entry, onDownload }) {
    const { student, report_cards } = entry;
    return (
        <Panel title={student.name}>
            <LedgerTable columns={['Exam', 'Percentage', 'Grade', 'Rank', '']}>
                {report_cards.map((rc) => (
                    <tr key={rc.id} className="border-b last:border-0" style={{ borderColor: '#F0EEE7' }}>
                        <td className="py-2 pr-4">{rc.exam?.name}</td>
                        <td className="py-2 pr-4">{rc.overall_percentage}%</td>
                        <td className="py-2 pr-4" style={{ color: GRADE_COLOR[rc.overall_grade] || '#22262B' }}>{rc.overall_grade}</td>
                        <td className="py-2 pr-4">#{rc.class_rank}</td>
                        <td className="py-2 pr-4">
                            <button onClick={() => onDownload(rc, student)} className="text-xs underline" style={{ color: '#1B2A4A' }}>Download PDF</button>
                        </td>
                    </tr>
                ))}
                {report_cards.length === 0 && (
                    <tr><td colSpan="5" className="py-6 text-center" style={{ color: '#6B7280' }}>No report cards yet.</td></tr>
                )}
            </LedgerTable>
        </Panel>
    );
}

export default function MyReportCards() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/portal/my-report-cards')
            .then((res) => setEntries(res.data))
            .catch(() => setError('Failed to load report cards.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleDownload(reportCard, student) {
        const res = await client.get(`/report-cards/${reportCard.id}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-card-${student.name}-${reportCard.exam?.name}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading report cards...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Report Cards" subtitle="Exam results and downloadable report cards" />
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {entries.length === 0 && <p style={{ color: '#6B7280' }}>No student record linked to this account yet.</p>}
                {entries.map((entry) => (
                    <ChildReportCards key={entry.student.id} entry={entry} onDownload={handleDownload} />
                ))}
            </div>
        </>
    );
}
