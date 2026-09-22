import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Row, Cell, Input, Select, Button, ActionButton, Avatar, PhotoPicker } from '../../components/ui';

export default function TeacherManagement() {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [years, setYears] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const emptyTeacherForm = { name: '', email: '', password: '' };
    const [teacherForm, setTeacherForm] = useState(emptyTeacherForm);
    const [photoFile, setPhotoFile] = useState(null);
    const [teacherFormError, setTeacherFormError] = useState(null);

    const emptyAssignForm = { teacher_user_id: '', subject_id: '', school_class_id: '', section_id: '', academic_year_id: '' };
    const [assignForm, setAssignForm] = useState(emptyAssignForm);
    const [assignFormError, setAssignFormError] = useState(null);

    function firstValidationMessage(err) {
        const errors = err.response?.data?.errors;
        if (errors) return Object.values(errors)[0][0];
        return err.response?.data?.message || 'Something went wrong.';
    }

    async function loadAll() {
        setLoading(true);
        try {
            const [t, s, c, y, a] = await Promise.all([
                client.get('/admin/users', { params: { role: 'teacher' } }),
                client.get('/super-admin/subjects'),
                client.get('/super-admin/school-classes'),
                client.get('/super-admin/academic-years'),
                client.get('/admin/teacher-assignments'),
            ]);
            setTeachers(t.data); setSubjects(s.data); setClasses(c.data); setYears(y.data); setAssignments(a.data);
        } catch (err) { setError('Failed to load teacher data.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadAll(); }, []);

    const sectionsForClass = (classId) => classes.find((c) => c.id === Number(classId))?.sections ?? [];

    async function addTeacher(e) {
        e.preventDefault();
        setTeacherFormError(null);
        try {
            const res = await client.post('/admin/users', { ...teacherForm, role: 'teacher' });
            if (photoFile) {
                const fd = new FormData();
                fd.append('photo', photoFile);
                await client.post(`/admin/users/${res.data.id}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setTeacherForm(emptyTeacherForm);
            setPhotoFile(null);
            loadAll();
        } catch (err) { setTeacherFormError(firstValidationMessage(err)); }
    }

    async function deleteTeacher(id) {
        if (!confirm('Delete this teacher account?')) return;
        await client.delete(`/admin/users/${id}`);
        loadAll();
    }

    async function addAssignment(e) {
        e.preventDefault();
        setAssignFormError(null);
        try { await client.post('/admin/teacher-assignments', assignForm); setAssignForm(emptyAssignForm); loadAll(); }
        catch (err) { setAssignFormError(firstValidationMessage(err)); }
    }
    async function removeAssignment(id) {
        await client.delete(`/admin/teacher-assignments/${id}`);
        loadAll();
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading teachers...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Teachers" subtitle="Staff accounts and their subject/class assignments" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Teachers" value={teachers.length} />
                    <StatCard label="Active assignments" value={assignments.length} />
                    <StatCard label="Subjects" value={subjects.length} />
                </div>

                <Panel title="Teachers">
                    {teacherFormError && <p className="text-sm mb-3" style={{ color: '#B3452D' }}>{teacherFormError}</p>}
                    <form onSubmit={addTeacher} className="space-y-3 mb-5 pb-5 border-b" style={{ borderColor: '#F0EEE7' }}>
                        <PhotoPicker file={photoFile} onChange={setPhotoFile} name={teacherForm.name} />
                        <div className="flex flex-wrap gap-2">
                            <Input placeholder="Name" className="w-32" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                            <Input placeholder="Email" className="w-48" type="email" value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} />
                            <Input placeholder="Password (min 8 chars)" className="w-48" type="password" value={teacherForm.password} onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })} />
                            <Button type="submit">Add</Button>
                        </div>
                    </form>

                    <LedgerTable columns={['Photo', 'Name', 'Email', 'Actions']}>
                        {teachers.map((t) => (
                            <Row key={t.id}>
                                <Cell><Avatar src={t.profile_photo ? `http://127.0.0.1:8000/storage/${t.profile_photo}` : null} name={t.name} size={32} /></Cell>
                                <Cell className="font-medium">{t.name}</Cell>
                                <Cell style={{ color: '#6B7280' }}>{t.email}</Cell>
                                <Cell><ActionButton kind="delete" onClick={() => deleteTeacher(t.id)}>Delete</ActionButton></Cell>
                            </Row>
                        ))}
                        {teachers.length === 0 && <tr><td colSpan="4" className="py-6 text-center" style={{ color: '#6B7280' }}>No teachers yet.</td></tr>}
                    </LedgerTable>
                </Panel>

                <Panel title="Subject / Class Assignments">
                    <LedgerTable columns={['Teacher', 'Subject', 'Class', 'Section', 'Actions']}>
                        {assignments.map((a) => (
                            <Row key={a.id}>
                                <Cell>{a.teacher?.name}</Cell>
                                <Cell>{a.subject?.name}</Cell>
                                <Cell>{a.school_class?.name}</Cell>
                                <Cell>{a.section?.name}</Cell>
                                <Cell><ActionButton kind="delete" onClick={() => removeAssignment(a.id)}>Remove</ActionButton></Cell>
                            </Row>
                        ))}
                    </LedgerTable>

                    <form onSubmit={addAssignment} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5 pt-5 border-t" style={{ borderColor: '#F0EEE7' }}>
                        <Select value={assignForm.teacher_user_id} onChange={(e) => setAssignForm({ ...assignForm, teacher_user_id: e.target.value })}>
                            <option value="">Teacher...</option>
                            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </Select>
                        <Select value={assignForm.subject_id} onChange={(e) => setAssignForm({ ...assignForm, subject_id: e.target.value })}>
                            <option value="">Subject...</option>
                            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                        <Select value={assignForm.school_class_id} onChange={(e) => setAssignForm({ ...assignForm, school_class_id: e.target.value, section_id: '' })}>
                            <option value="">Class...</option>
                            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        <Select value={assignForm.section_id} onChange={(e) => setAssignForm({ ...assignForm, section_id: e.target.value })} disabled={!assignForm.school_class_id}>
                            <option value="">Section...</option>
                            {sectionsForClass(assignForm.school_class_id).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                        <Select value={assignForm.academic_year_id} onChange={(e) => setAssignForm({ ...assignForm, academic_year_id: e.target.value })} className="sm:col-span-2">
                            <option value="">Academic year...</option>
                            {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                        </Select>
                        <div className="sm:col-span-2"><Button type="submit">Assign</Button></div>
                    </form>
                </Panel>
            </div>
        </>
    );
}
