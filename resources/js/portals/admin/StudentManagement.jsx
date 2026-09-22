import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Row, Cell, Input, Select, Button, ActionButton, Avatar, PhotoPicker } from '../../components/ui';

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');

    const emptyForm = {
        name: '', email: '', password: '', admission_number: '',
        school_class_id: '', section_id: '', academic_year_id: '',
        guardian_name: '', guardian_phone: '',
    };
    const [form, setForm] = useState(emptyForm);
    const [photoFile, setPhotoFile] = useState(null);
    const [formError, setFormError] = useState(null);

    async function loadStudents(classId = '') {
        const params = classId ? { school_class_id: classId } : {};
        const res = await client.get('/admin/students', { params });
        setStudents(res.data);
    }

    async function loadAll() {
        setLoading(true);
        try {
            const [s, c, y] = await Promise.all([
                client.get('/admin/students'),
                client.get('/super-admin/school-classes'),
                client.get('/super-admin/academic-years'),
            ]);
            setStudents(s.data);
            setClasses(c.data);
            setYears(y.data);
        } catch (err) {
            setError('Failed to load student data.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadAll(); }, []);

    const sectionsForClass = (classId) => classes.find((c) => c.id === Number(classId))?.sections ?? [];

    async function handleFilterChange(e) {
        const classId = e.target.value;
        setSelectedClass(classId);
        await loadStudents(classId);
    }

    async function deleteStudent(id) {
        if (!confirm('Delete this student? This also deletes their login account.')) return;
        await client.delete(`/admin/students/${id}`);
        loadStudents(selectedClass);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);
        try {
            const res = await client.post('/admin/students', form);
            if (photoFile) {
                const fd = new FormData();
                fd.append('photo', photoFile);
                await client.post(`/admin/users/${res.data.user.id}/photo`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            setForm(emptyForm);
            setPhotoFile(null);
            loadStudents(selectedClass);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Could not create student.');
        }
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading students...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Students" subtitle="Enrollment records across all classes" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Total students" value={students.length} />
                    <StatCard label="Classes" value={classes.length} />
                    <StatCard label="Filtered view" value={selectedClass ? classes.find(c => c.id === Number(selectedClass))?.name : 'All'} />
                </div>

                <Panel
                    title="Roster"
                    action={
                        <Select value={selectedClass} onChange={handleFilterChange} className="w-40">
                            <option value="">All classes</option>
                            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                    }
                >
                    <LedgerTable columns={['Photo', 'Admission #', 'Name', 'Class', 'Section', 'Guardian', 'Actions']}>
                        {students.map((s) => (
                            <Row key={s.id}>
                                <Cell><Avatar src={s.user?.profile_photo ? `http://127.0.0.1:8000/storage/${s.user.profile_photo}` : null} name={s.user?.name} size={32} /></Cell>
                                <Cell>{s.admission_number}</Cell>
                                <Cell className="font-medium">{s.user?.name}</Cell>
                                <Cell>{s.school_class?.name}</Cell>
                                <Cell>{s.section?.name}</Cell>
                                <Cell style={{ color: '#6B7280' }}>{s.guardian_name || '—'}</Cell>
                                <Cell><ActionButton kind="delete" onClick={() => deleteStudent(s.id)}>Delete</ActionButton></Cell>
                            </Row>
                        ))}
                        {students.length === 0 && (
                            <tr><td colSpan="7" className="py-6 text-center" style={{ color: '#6B7280' }}>No students yet.</td></tr>
                        )}
                    </LedgerTable>
                </Panel>

                <Panel title="Admit a New Student">
                    {formError && <p className="text-sm mb-3" style={{ color: '#B3452D' }}>{formError}</p>}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <PhotoPicker file={photoFile} onChange={setPhotoFile} name={form.name} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <Input placeholder="Admission number" value={form.admission_number} onChange={(e) => setForm({ ...form, admission_number: e.target.value })} />

                            <Select value={form.school_class_id} onChange={(e) => setForm({ ...form, school_class_id: e.target.value, section_id: '' })}>
                                <option value="">Class...</option>
                                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                            <Select value={form.section_id} onChange={(e) => setForm({ ...form, section_id: e.target.value })} disabled={!form.school_class_id}>
                                <option value="">Section...</option>
                                {sectionsForClass(form.school_class_id).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                            <Select value={form.academic_year_id} onChange={(e) => setForm({ ...form, academic_year_id: e.target.value })}>
                                <option value="">Academic year...</option>
                                {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                            </Select>
                            <div />

                            <Input placeholder="Guardian name" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} />
                            <Input placeholder="Guardian phone" value={form.guardian_phone} onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })} />
                        </div>

                        <Button type="submit">Admit Student</Button>
                    </form>
                </Panel>
            </div>
        </>
    );
}
