import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, LedgerTable } from '../../components/ui';

const STATUS_COLOR = { paid: '#2F7D5C', partial: '#B8860B', pending: '#6B7280', overdue: '#B3452D' };

function ChildFees({ entry }) {
    const { student, invoices } = entry;
    return (
        <Panel title={student.name}>
            <LedgerTable columns={['Category', 'Amount Due', 'Due Date', 'Status', 'Paid So Far']}>
                {invoices.map((inv) => {
                    const paid = inv.payments.reduce((s, p) => s + Number(p.amount_paid), 0);
                    return <tr key={inv.id} className="border-b last:border-0"><td className="py-2 pr-4">{inv.fee_structure?.fee_category?.name}</td><td className="py-2 pr-4">${Number(inv.amount_due).toFixed(2)}</td><td className="py-2 pr-4">{inv.due_date?.slice(0, 10)}</td><td className="py-2 pr-4" style={{ color: STATUS_COLOR[inv.status] }}>{inv.status}</td><td className="py-2 pr-4">${paid.toFixed(2)}</td></tr>;
                })}
                {invoices.length === 0 && <tr><td colSpan="5" className="py-6 text-center" style={{ color: '#6B7280' }}>No fee invoices yet.</td></tr>}
            </LedgerTable>
        </Panel>
    );
}

export default function MyFees() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/portal/my-fees').then((res) => setEntries(res.data)).catch(() => setError('Failed to load fees.')).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading fees...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return <><PageHeader title="Fees" subtitle="Invoices and payment status" /><div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">{entries.length === 0 && <p style={{ color: '#6B7280' }}>No student record linked to this account yet.</p>}{entries.map((entry) => <ChildFees key={entry.student.id} entry={entry} />)}</div></>;
}
