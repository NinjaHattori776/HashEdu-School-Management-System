import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Row, Cell, Input, Button, ActionButton } from '../../components/ui';

function firstValidationMessage(err) {
    const errors = err.response?.data?.errors;
    if (errors) return Object.values(errors)[0][0];
    return err.response?.data?.message || 'Something went wrong.';
}

export default function AcademicSetup() {
    const [years, setYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newSubject, setNewSubject] = useState({ name: '', code: '' });
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [editSubjectForm, setEditSubjectForm] = useState({ name: '', code: '' });

    const [newYear, setNewYear] = useState({ name: '', start_date: '', end_date: '' });
    const [editingYearId, setEditingYearId] = useState(null);
    const [editYearForm, setEditYearForm] = useState({});

    const [newClass, setNewClass] = useState({ name: '', numeric_level: '' });
    const [editingClassId, setEditingClassId] = useState(null);
    const [editClassForm, setEditClassForm] = useState({});

    async function loadAll() {
        setLoading(true);
        try {
            const [y, c, s] = await Promise.all([
                client.get('/super-admin/academic-years'),
                client.get('/super-admin/school-classes'),
                client.get('/super-admin/subjects'),
            ]);
            setYears(y.data); setClasses(c.data); setSubjects(s.data);
        } catch (err) { setError('Failed to load academic setup data.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadAll(); }, []);

    async function addSubject(e) {
        e.preventDefault();
        if (!newSubject.name || !newSubject.code) return;
        try { await client.post('/super-admin/subjects', newSubject); setNewSubject({ name: '', code: '' }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    function startEditSubject(s) { setEditingSubjectId(s.id); setEditSubjectForm({ name: s.name, code: s.code }); }
    async function saveEditSubject(id) {
        try { await client.put(`/super-admin/subjects/${id}`, editSubjectForm); setEditingSubjectId(null); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteSubject(id) {
        if (!confirm('Delete this subject? This may fail if it is used in a class or exam.')) return;
        try { await client.delete(`/super-admin/subjects/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    async function addYear(e) {
        e.preventDefault();
        try { await client.post('/super-admin/academic-years', newYear); setNewYear({ name: '', start_date: '', end_date: '' }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    function startEditYear(y) { setEditingYearId(y.id); setEditYearForm({ name: y.name, start_date: y.start_date?.slice(0,10), end_date: y.end_date?.slice(0,10), is_current: y.is_current }); }
    async function saveEditYear(id) {
        try { await client.put(`/super-admin/academic-years/${id}`, editYearForm); setEditingYearId(null); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteYear(id) {
        if (!confirm('Delete this academic year? This may fail if students or exams reference it.')) return;
        try { await client.delete(`/super-admin/academic-years/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function setCurrentYear(id) {
        try { await client.put(`/super-admin/academic-years/${id}`, { is_current: true }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    async function addClass(e) {
        e.preventDefault();
        try { await client.post('/super-admin/school-classes', newClass); setNewClass({ name: '', numeric_level: '' }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    function startEditClass(c) { setEditingClassId(c.id); setEditClassForm({ name: c.name, numeric_level: c.numeric_level }); }
    async function saveEditClass(id) {
        try { await client.put(`/super-admin/school-classes/${id}`, editClassForm); setEditingClassId(null); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteClass(id) {
        if (!confirm('Delete this class? This will fail if students, sections, or exams reference it.')) return;
        try { await client.delete(`/super-admin/school-classes/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading academic setup...</div>;

    const currentYear = years.find((y) => y.is_current);

    return (
        <>
            <PageHeader title="Academic Setup" subtitle="Classes, sections, subjects, and the academic calendar" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {error && (
                    <div className="rounded-xl px-4 py-3 text-sm flex justify-between items-center" style={{ background: '#FBEAE6', color: '#B3452D' }}>
                        {error}
                        <button onClick={() => setError(null)} className="font-semibold">✕</button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Academic year" value={currentYear?.name || '—'} />
                    <StatCard label="Classes" value={classes.length} />
                    <StatCard label="Subjects" value={subjects.length} />
                </div>

                <Panel title="Academic Years">
                    <LedgerTable columns={['Name', 'Start', 'End', 'Current', 'Actions']}>
                        {years.map((y) => editingYearId === y.id ? (
                            <Row key={y.id}>
                                <Cell><Input value={editYearForm.name} onChange={(e) => setEditYearForm({ ...editYearForm, name: e.target.value })} /></Cell>
                                <Cell><input type="date" className="border px-2 py-1.5 text-sm rounded-lg" style={{ borderColor: '#D8D5CB' }} value={editYearForm.start_date} onChange={(e) => setEditYearForm({ ...editYearForm, start_date: e.target.value })} /></Cell>
                                <Cell><input type="date" className="border px-2 py-1.5 text-sm rounded-lg" style={{ borderColor: '#D8D5CB' }} value={editYearForm.end_date} onChange={(e) => setEditYearForm({ ...editYearForm, end_date: e.target.value })} /></Cell>
                                <Cell>{y.is_current ? '✓' : ''}</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="confirm" onClick={() => saveEditYear(y.id)}>Save</ActionButton>
                                    <ActionButton kind="neutral" onClick={() => setEditingYearId(null)}>Cancel</ActionButton>
                                </Cell>
                            </Row>
                        ) : (
                            <Row key={y.id}>
                                <Cell className="font-medium">{y.name}</Cell>
                                <Cell>{y.start_date?.slice(0,10)}</Cell>
                                <Cell>{y.end_date?.slice(0,10)}</Cell>
                                <Cell>{y.is_current ? <span style={{ color: '#B8860B' }}>● Current</span> : <button onClick={() => setCurrentYear(y.id)} className="text-xs underline" style={{ color: '#6B7280' }}>Set current</button>}</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="edit" onClick={() => startEditYear(y)}>Edit</ActionButton>
                                    <ActionButton kind="delete" onClick={() => deleteYear(y.id)}>Delete</ActionButton>
                                </Cell>
                            </Row>
                        ))}
                    </LedgerTable>
                    <form onSubmit={addYear} className="flex flex-wrap gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#F0EEE7' }}>
                        <Input placeholder="Name (e.g. 2027-2028)" className="w-40" value={newYear.name} onChange={(e) => setNewYear({ ...newYear, name: e.target.value })} />
                        <input type="date" className="border px-3.5 py-2.5 text-sm rounded-xl" style={{ borderColor: '#D8D5CB' }} value={newYear.start_date} onChange={(e) => setNewYear({ ...newYear, start_date: e.target.value })} />
                        <input type="date" className="border px-3.5 py-2.5 text-sm rounded-xl" style={{ borderColor: '#D8D5CB' }} value={newYear.end_date} onChange={(e) => setNewYear({ ...newYear, end_date: e.target.value })} />
                        <Button type="submit">Add Year</Button>
                    </form>
                </Panel>

                <Panel title="Classes (1–13) & Sections">
                    <LedgerTable columns={['Name', 'Level', 'Sections', 'Subjects', 'Actions']}>
                        {classes.map((c) => editingClassId === c.id ? (
                            <Row key={c.id}>
                                <Cell><Input value={editClassForm.name} onChange={(e) => setEditClassForm({ ...editClassForm, name: e.target.value })} /></Cell>
                                <Cell><Input type="number" value={editClassForm.numeric_level} onChange={(e) => setEditClassForm({ ...editClassForm, numeric_level: e.target.value })} /></Cell>
                                <Cell colSpan="2">{c.sections.map((s) => s.name).join(', ')}</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="confirm" onClick={() => saveEditClass(c.id)}>Save</ActionButton>
                                    <ActionButton kind="neutral" onClick={() => setEditingClassId(null)}>Cancel</ActionButton>
                                </Cell>
                            </Row>
                        ) : (
                            <Row key={c.id}>
                                <Cell className="font-medium">{c.name}</Cell>
                                <Cell>{c.numeric_level}</Cell>
                                <Cell>{c.sections.map((s) => s.name).join(', ') || '—'}</Cell>
                                <Cell>{c.subjects.length}</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="edit" onClick={() => startEditClass(c)}>Edit</ActionButton>
                                    <ActionButton kind="delete" onClick={() => deleteClass(c.id)}>Delete</ActionButton>
                                </Cell>
                            </Row>
                        ))}
                    </LedgerTable>
                    <form onSubmit={addClass} className="flex flex-wrap gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#F0EEE7' }}>
                        <Input placeholder="Name (e.g. Class 14)" className="w-40" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} />
                        <Input placeholder="Level (number)" type="number" className="w-32" value={newClass.numeric_level} onChange={(e) => setNewClass({ ...newClass, numeric_level: e.target.value })} />
                        <Button type="submit">Add Class</Button>
                    </form>
                </Panel>

                <Panel title="Subjects">
                    <LedgerTable columns={['Subject', 'Code', 'Actions']}>
                        {subjects.map((s) => editingSubjectId === s.id ? (
                            <Row key={s.id}>
                                <Cell><Input value={editSubjectForm.name} onChange={(e) => setEditSubjectForm({ ...editSubjectForm, name: e.target.value })} /></Cell>
                                <Cell><Input value={editSubjectForm.code} onChange={(e) => setEditSubjectForm({ ...editSubjectForm, code: e.target.value })} /></Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="confirm" onClick={() => saveEditSubject(s.id)}>Save</ActionButton>
                                    <ActionButton kind="neutral" onClick={() => setEditingSubjectId(null)}>Cancel</ActionButton>
                                </Cell>
                            </Row>
                        ) : (
                            <Row key={s.id}>
                                <Cell className="font-medium">{s.name}</Cell>
                                <Cell style={{ color: '#6B7280' }}>{s.code}</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="edit" onClick={() => startEditSubject(s)}>Edit</ActionButton>
                                    <ActionButton kind="delete" onClick={() => deleteSubject(s.id)}>Delete</ActionButton>
                                </Cell>
                            </Row>
                        ))}
                    </LedgerTable>
                    <form onSubmit={addSubject} className="flex gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#F0EEE7' }}>
                        <Input placeholder="Subject name" className="w-40" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} />
                        <Input placeholder="Code" className="w-24" value={newSubject.code} onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })} />
                        <Button type="submit">Add</Button>
                    </form>
                </Panel>
            </div>
        </>
    );
}
