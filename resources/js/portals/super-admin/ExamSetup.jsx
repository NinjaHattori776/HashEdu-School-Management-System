import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Row, Cell, Input, Select, Button, ActionButton } from '../../components/ui';

function firstValidationMessage(err) {
    const errors = err.response?.data?.errors;
    if (errors) return Object.values(errors)[0][0];
    return err.response?.data?.message || 'Something went wrong.';
}

export default function ExamSetup() {
    const [examTypes, setExamTypes] = useState([]);
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [typeForm, setTypeForm] = useState({ name: '', weight_percent: '' });
    const [editingTypeId, setEditingTypeId] = useState(null);
    const [editTypeForm, setEditTypeForm] = useState({});

    const emptyExamForm = { exam_type_id: '', school_class_id: '', academic_year_id: '', name: '', start_date: '', end_date: '' };
    const [examForm, setExamForm] = useState(emptyExamForm);
    const [editingExamId, setEditingExamId] = useState(null);
    const [editExamForm, setEditExamForm] = useState({});

    const [subjectForm, setSubjectForm] = useState({ exam_id: '', subject_id: '', max_marks: '100', pass_marks: '35' });
    const [subjectFormSuccess, setSubjectFormSuccess] = useState(null);

    async function loadAll() {
        setLoading(true);
        try {
            const [t, e, c, y, s] = await Promise.all([
                client.get('/super-admin/exam-types'),
                client.get('/super-admin/exams'),
                client.get('/super-admin/school-classes'),
                client.get('/super-admin/academic-years'),
                client.get('/super-admin/subjects'),
            ]);
            setExamTypes(t.data); setExams(e.data); setClasses(c.data); setYears(y.data); setSubjects(s.data);
        } catch (err) { setError('Failed to load exam setup data.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadAll(); }, []);

    async function addExamType(e) {
        e.preventDefault();
        try { await client.post('/super-admin/exam-types', typeForm); setTypeForm({ name: '', weight_percent: '' }); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    function startEditType(t) { setEditingTypeId(t.id); setEditTypeForm({ name: t.name, weight_percent: t.weight_percent }); }
    async function saveEditType(id) {
        try { await client.put(`/super-admin/exam-types/${id}`, editTypeForm); setEditingTypeId(null); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteType(id) {
        if (!confirm('Delete this exam type? Fails if exams use it.')) return;
        try { await client.delete(`/super-admin/exam-types/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    async function addExam(e) {
        e.preventDefault();
        try { await client.post('/super-admin/exams', examForm); setExamForm(emptyExamForm); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    function startEditExam(ex) { setEditingExamId(ex.id); setEditExamForm({ name: ex.name, start_date: ex.start_date?.slice(0,10), end_date: ex.end_date?.slice(0,10) }); }
    async function saveEditExam(id) {
        try { await client.put(`/super-admin/exams/${id}`, editExamForm); setEditingExamId(null); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }
    async function deleteExam(id) {
        if (!confirm('Delete this exam? This also removes its subjects, marks, and report cards.')) return;
        try { await client.delete(`/super-admin/exams/${id}`); loadAll(); }
        catch (err) { setError(firstValidationMessage(err)); }
    }

    async function addSubjectToExam(e) {
        e.preventDefault();
        setSubjectFormSuccess(null);
        try {
            const res = await client.post(`/super-admin/exams/${subjectForm.exam_id}/subjects`, {
                subject_id: subjectForm.subject_id, max_marks: subjectForm.max_marks, pass_marks: subjectForm.pass_marks,
            });
            setSubjectFormSuccess(`Added ${res.data.subject?.name} to the exam.`);
            setSubjectForm({ ...subjectForm, subject_id: '' });
            loadAll();
        } catch (err) { setError(firstValidationMessage(err)); }
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading exam setup...</div>;

    return (
        <>
            <PageHeader title="Exam Setup" subtitle="Exam types, exams, and the subjects covered in each" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {error && (
                    <div className="rounded-xl px-4 py-3 text-sm flex justify-between items-center" style={{ background: '#FBEAE6', color: '#B3452D' }}>
                        {error}<button onClick={() => setError(null)} className="font-semibold">✕</button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Exam types" value={examTypes.length} />
                    <StatCard label="Exams" value={exams.length} />
                    <StatCard label="Subjects" value={subjects.length} />
                </div>

                <Panel title="Exam Types">
                    <LedgerTable columns={['Name', 'Weight %', 'Actions']}>
                        {examTypes.map((t) => editingTypeId === t.id ? (
                            <Row key={t.id}>
                                <Cell><Input value={editTypeForm.name} onChange={(e) => setEditTypeForm({ ...editTypeForm, name: e.target.value })} /></Cell>
                                <Cell><Input value={editTypeForm.weight_percent || ''} onChange={(e) => setEditTypeForm({ ...editTypeForm, weight_percent: e.target.value })} /></Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="confirm" onClick={() => saveEditType(t.id)}>Save</ActionButton>
                                    <ActionButton kind="neutral" onClick={() => setEditingTypeId(null)}>Cancel</ActionButton>
                                </Cell>
                            </Row>
                        ) : (
                            <Row key={t.id}>
                                <Cell className="font-medium">{t.name}</Cell>
                                <Cell style={{ color: '#6B7280' }}>{t.weight_percent ?? '—'}</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="edit" onClick={() => startEditType(t)}>Edit</ActionButton>
                                    <ActionButton kind="delete" onClick={() => deleteType(t.id)}>Delete</ActionButton>
                                </Cell>
                            </Row>
                        ))}
                    </LedgerTable>
                    <form onSubmit={addExamType} className="flex flex-wrap gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#F0EEE7' }}>
                        <Input placeholder="Name (e.g. Midterm)" className="w-48" value={typeForm.name} onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })} />
                        <Input placeholder="Weight % (optional)" className="w-40" value={typeForm.weight_percent} onChange={(e) => setTypeForm({ ...typeForm, weight_percent: e.target.value })} />
                        <Button type="submit">Add</Button>
                    </form>
                </Panel>

                <Panel title="Exams">
                    <LedgerTable columns={['Name', 'Type', 'Class', 'Dates', 'Subjects', 'Actions']}>
                        {exams.map((e) => editingExamId === e.id ? (
                            <Row key={e.id}>
                                <Cell><Input value={editExamForm.name} onChange={(ev) => setEditExamForm({ ...editExamForm, name: ev.target.value })} /></Cell>
                                <Cell>{e.exam_type?.name}</Cell>
                                <Cell>{e.school_class?.name}</Cell>
                                <Cell className="flex gap-1">
                                    <input type="date" className="border px-2 py-1.5 text-xs rounded-lg" style={{ borderColor: '#D8D5CB' }} value={editExamForm.start_date} onChange={(ev) => setEditExamForm({ ...editExamForm, start_date: ev.target.value })} />
                                    <input type="date" className="border px-2 py-1.5 text-xs rounded-lg" style={{ borderColor: '#D8D5CB' }} value={editExamForm.end_date} onChange={(ev) => setEditExamForm({ ...editExamForm, end_date: ev.target.value })} />
                                </Cell>
                                <Cell>—</Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="confirm" onClick={() => saveEditExam(e.id)}>Save</ActionButton>
                                    <ActionButton kind="neutral" onClick={() => setEditingExamId(null)}>Cancel</ActionButton>
                                </Cell>
                            </Row>
                        ) : (
                            <Row key={e.id}>
                                <Cell className="font-medium">{e.name}</Cell>
                                <Cell>{e.exam_type?.name}</Cell>
                                <Cell>{e.school_class?.name}</Cell>
                                <Cell style={{ color: '#6B7280' }}>{e.start_date?.slice(0,10)} – {e.end_date?.slice(0,10)}</Cell>
                                <Cell style={{ color: '#6B7280' }}>
                                    {e.exam_subjects?.length > 0 ? e.exam_subjects.map((es) => `${es.subject?.name} (${es.max_marks})`).join(', ') : <span style={{ color: '#B3452D' }}>None yet</span>}
                                </Cell>
                                <Cell className="flex gap-2">
                                    <ActionButton kind="edit" onClick={() => startEditExam(e)}>Edit</ActionButton>
                                    <ActionButton kind="delete" onClick={() => deleteExam(e.id)}>Delete</ActionButton>
                                </Cell>
                            </Row>
                        ))}
                    </LedgerTable>

                    <form onSubmit={addExam} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#F0EEE7' }}>
                        <Input placeholder="Exam name" value={examForm.name} onChange={(e) => setExamForm({ ...examForm, name: e.target.value })} className="sm:col-span-2" />
                        <Select value={examForm.exam_type_id} onChange={(e) => setExamForm({ ...examForm, exam_type_id: e.target.value })}>
                            <option value="">Exam type...</option>
                            {examTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </Select>
                        <Select value={examForm.school_class_id} onChange={(e) => setExamForm({ ...examForm, school_class_id: e.target.value })}>
                            <option value="">Class...</option>
                            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        <Select value={examForm.academic_year_id} onChange={(e) => setExamForm({ ...examForm, academic_year_id: e.target.value })} className="sm:col-span-2">
                            <option value="">Academic year...</option>
                            {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                        </Select>
                        <input type="date" value={examForm.start_date} onChange={(e) => setExamForm({ ...examForm, start_date: e.target.value })} className="border px-3.5 py-2.5 text-sm rounded-xl" style={{ borderColor: '#D8D5CB' }} />
                        <input type="date" value={examForm.end_date} onChange={(e) => setExamForm({ ...examForm, end_date: e.target.value })} className="border px-3.5 py-2.5 text-sm rounded-xl" style={{ borderColor: '#D8D5CB' }} />
                        <div className="sm:col-span-2"><Button type="submit">Create Exam</Button></div>
                    </form>
                </Panel>

                <Panel title="Add Subjects to an Exam">
                    {subjectFormSuccess && <p className="text-sm mb-3" style={{ color: '#2F7D5C' }}>{subjectFormSuccess}</p>}
                    <form onSubmit={addSubjectToExam} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Select value={subjectForm.exam_id} onChange={(e) => setSubjectForm({ ...subjectForm, exam_id: e.target.value })} className="sm:col-span-2">
                            <option value="">Exam...</option>
                            {exams.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.school_class?.name}</option>)}
                        </Select>
                        <Select value={subjectForm.subject_id} onChange={(e) => setSubjectForm({ ...subjectForm, subject_id: e.target.value })}>
                            <option value="">Subject...</option>
                            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                        <div className="flex gap-2">
                            <Input placeholder="Max marks" value={subjectForm.max_marks} onChange={(e) => setSubjectForm({ ...subjectForm, max_marks: e.target.value })} />
                            <Input placeholder="Pass marks" value={subjectForm.pass_marks} onChange={(e) => setSubjectForm({ ...subjectForm, pass_marks: e.target.value })} />
                        </div>
                        <div className="sm:col-span-2">
                            <Button type="submit" disabled={!subjectForm.exam_id || !subjectForm.subject_id}>Add Subject to Exam</Button>
                        </div>
                    </form>
                </Panel>
            </div>
        </>
    );
}
