import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Input, Select, Button } from '../../components/ui';

function firstValidationMessage(err) {
    const errors = err.response?.data?.errors;
    if (errors) return Object.values(errors)[0][0];
    return err.response?.data?.message || 'Something went wrong.';
}

export default function FeeManagement() {
    const [categories, setCategories] = useState([]);
    const [structures, setStructures] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [classes, setClasses] = useState([]);
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [categoryForm, setCategoryForm] = useState({ name: '' });
    const [structureForm, setStructureForm] = useState({ school_class_id: '', academic_year_id: '', fee_category_id: '', amount: '', frequency: 'monthly' });
    const [generateForm, setGenerateForm] = useState({ fee_structure_id: '', due_date: '' });
    const [paymentForms, setPaymentForms] = useState({}); // invoiceId -> {amount_paid, payment_date, payment_method}

    async function loadAll() {
        setLoading(true);
        try {
            const [cat, struct, inv, cls, yr] = await Promise.all([
                client.get('/admin/fee-categories'),
                client.get('/admin/fee-structures'),
                client.get('/admin/fee-invoices'),
                client.get('/super-admin/school-classes').catch(() => ({ data: [] })),
                client.get('/super-admin/academic-years').catch(() => ({ data: [] })),
            ]);
            setCategories(cat.data); setStructures(struct.data); setInvoices(inv.data); setClasses(cls.data); setYears(yr.data);
        } catch (err) { setError('Failed to load fee data.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadAll(); }, []);

    async function addCategory(e) {
        e.preventDefault();
        try { await client.post('/admin/fee-categories', categoryForm); setCategoryForm({ name: '' }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteCategory(id) {
        if (!confirm('Delete this fee category?')) return;
        try { await client.delete(`/admin/fee-categories/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    async function addStructure(e) {
        e.preventDefault();
        try { await client.post('/admin/fee-structures', structureForm); setStructureForm({ ...structureForm, amount: '' }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteStructure(id) {
        if (!confirm('Delete this fee structure?')) return;
        try { await client.delete(`/admin/fee-structures/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    async function generateInvoices(e) {
        e.preventDefault();
        try {
            const res = await client.post('/admin/fee-invoices/generate', generateForm);
            setError(null);
            alert(res.data.message);
            loadAll();
        } catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteInvoice(id) {
        if (!confirm('Delete this invoice?')) return;
        try { await client.delete(`/admin/fee-invoices/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    function setPaymentField(invoiceId, field, value) {
        setPaymentForms((prev) => ({ ...prev, [invoiceId]: { ...prev[invoiceId], [field]: value } }));
    }
    async function recordPayment(invoiceId) {
        const form = paymentForms[invoiceId] || {};
        try {
            await client.post(`/admin/fee-invoices/${invoiceId}/payments`, {
                amount_paid: form.amount_paid,
                payment_date: form.payment_date || new Date().toISOString().slice(0, 10),
                payment_method: form.payment_method || 'cash',
            });
            setPaymentForms((prev) => ({ ...prev, [invoiceId]: {} }));
            loadAll();
        } catch (err) { setError(firstValidationMessage(err)); }
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading fees...</div>;

    const STATUS_COLOR = { paid: '#2F7D5C', partial: '#B8860B', pending: '#6B7280', overdue: '#B3452D' };
    const totalDue = invoices.reduce((s, i) => s + Number(i.amount_due), 0);
    const totalCollected = invoices.reduce((s, i) => s + i.payments.reduce((ps, p) => ps + Number(p.amount_paid), 0), 0);

    return (
        <>
            <PageHeader title="Fees" subtitle="Fee categories, structures, invoices, and payments" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {error && <p className="text-sm" style={{ color: '#B3452D' }}>{error} <button onClick={() => setError(null)} className="underline">dismiss</button></p>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Invoices" value={invoices.length} />
                    <StatCard label="Total due" value={`$${totalDue.toFixed(2)}`} />
                    <StatCard label="Collected" value={`$${totalCollected.toFixed(2)}`} />
                </div>
                <Panel title="Fee Categories">
                    <LedgerTable columns={['Name', '']}>
                        {categories.map((c) => <tr key={c.id} className="border-b last:border-0"><td className="py-2 pr-4">{c.name}</td><td className="py-2"><button onClick={() => deleteCategory(c.id)} className="text-xs" style={{ color: '#B3452D' }}>Delete</button></td></tr>)}
                    </LedgerTable>
                    <form onSubmit={addCategory} className="flex gap-2 mt-4 pt-4 border-t"><Input placeholder="Category name (e.g. Tuition)" value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} /><Button type="submit">Add</Button></form>
                </Panel>
                <Panel title="Fee Structures">
                    <LedgerTable columns={['Class', 'Year', 'Category', 'Amount', 'Frequency', '']}>
                        {structures.map((s) => <tr key={s.id} className="border-b last:border-0"><td className="py-2 pr-4">{s.school_class?.name}</td><td className="py-2 pr-4">{s.academic_year?.name}</td><td className="py-2 pr-4">{s.fee_category?.name}</td><td className="py-2 pr-4">${Number(s.amount).toFixed(2)}</td><td className="py-2 pr-4 capitalize">{s.frequency}</td><td className="py-2"><button onClick={() => deleteStructure(s.id)} className="text-xs" style={{ color: '#B3452D' }}>Delete</button></td></tr>)}
                    </LedgerTable>
                    <form onSubmit={addStructure} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t">
                        <Select value={structureForm.school_class_id} onChange={(e) => setStructureForm({ ...structureForm, school_class_id: e.target.value })}><option value="">Class...</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
                        <Select value={structureForm.academic_year_id} onChange={(e) => setStructureForm({ ...structureForm, academic_year_id: e.target.value })}><option value="">Academic year...</option>{years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}</Select>
                        <Select value={structureForm.fee_category_id} onChange={(e) => setStructureForm({ ...structureForm, fee_category_id: e.target.value })}><option value="">Category...</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
                        <Input placeholder="Amount" value={structureForm.amount} onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })} />
                        <Select value={structureForm.frequency} onChange={(e) => setStructureForm({ ...structureForm, frequency: e.target.value })}><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="one_time">One-time</option></Select>
                        <Button type="submit">Add Structure</Button>
                    </form>
                </Panel>
                <Panel title="Generate Invoices">
                    <form onSubmit={generateInvoices} className="flex flex-wrap gap-2"><Select value={generateForm.fee_structure_id} onChange={(e) => setGenerateForm({ ...generateForm, fee_structure_id: e.target.value })} className="w-64"><option value="">Fee structure...</option>{structures.map((s) => <option key={s.id} value={s.id}>{s.school_class?.name} — {s.fee_category?.name} (${s.amount})</option>)}</Select><input type="date" value={generateForm.due_date} onChange={(e) => setGenerateForm({ ...generateForm, due_date: e.target.value })} className="border px-3 py-2 text-sm" /><Button type="submit">Generate for All Students in Class</Button></form>
                    <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Safe to re-run — students who already have an invoice for this structure are skipped.</p>
                </Panel>
                <Panel title="Invoices">
                    <LedgerTable columns={['Student', 'Category', 'Due', 'Status', 'Record Payment', '']}>
                        {invoices.map((inv) => <tr key={inv.id} className="border-b last:border-0"><td className="py-2 pr-4">{inv.student?.user?.name}</td><td className="py-2 pr-4">{inv.fee_structure?.fee_category?.name}</td><td className="py-2 pr-4">${Number(inv.amount_due).toFixed(2)} by {inv.due_date?.slice(0, 10)}</td><td className="py-2 pr-4"><span style={{ color: STATUS_COLOR[inv.status] }}>{inv.status}</span></td><td className="py-2 pr-4">{inv.status !== 'paid' && <div className="flex gap-1"><Input placeholder="Amount" className="w-20" value={paymentForms[inv.id]?.amount_paid || ''} onChange={(e) => setPaymentField(inv.id, 'amount_paid', e.target.value)} /><button onClick={() => recordPayment(inv.id)} className="text-xs px-2" style={{ background: '#1B2A4A', color: '#fff' }}>Pay</button></div>}</td><td><button onClick={() => deleteInvoice(inv.id)} className="text-xs" style={{ color: '#B3452D' }}>Delete</button></td></tr>)}
                    </LedgerTable>
                </Panel>
            </div>
        </>
    );
}
