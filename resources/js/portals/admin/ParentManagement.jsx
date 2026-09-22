import { useEffect, useState } from 'react';
import client from '../../api/client';
import { PageHeader, Panel, StatCard, LedgerTable, Row, Cell, Input, Select, Button, ActionButton, Avatar, PhotoPicker } from '../../components/ui';

export default function ParentManagement() {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [childrenByParent, setChildrenByParent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const emptyParentForm = { name: '', email: '', password: '' };
    const [parentForm, setParentForm] = useState(emptyParentForm);
    const [photoFile, setPhotoFile] = useState(null);
    const [parentFormError, setParentFormError] = useState(null);

    const emptyLinkForm = { parent_user_id: '', student_id: '' };
    const [linkForm, setLinkForm] = useState(emptyLinkForm);
    const [linkFormError, setLinkFormError] = useState(null);

    function firstValidationMessage(err) {
        const errors = err.response?.data?.errors;
        if (errors) return Object.values(errors)[0][0];
        return err.response?.data?.message || 'Something went wrong.';
    }

    async function loadAll() {
        setLoading(true);
        try {
            const [p, s] = await Promise.all([
                client.get('/admin/users', { params: { role: 'parent' } }),
                client.get('/admin/students'),
            ]);
            setParents(p.data);
            setStudents(s.data);

            const childrenEntries = await Promise.all(
                p.data.map((parent) => client.get(`/admin/parents/${parent.id}/children`).then((res) => [parent.id, res.data]))
            );
            setChildrenByParent(Object.fromEntries(childrenEntries));
        } catch (err) { setError('Failed to load parent data.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadAll(); }, []);

    async function addParent(e) {
        e.preventDefault();
        setParentFormError(null);
        try {
            const res = await client.post('/admin/users', { ...parentForm, role: 'parent' });
            if (photoFile) {
                const fd = new FormData();
                fd.append('photo', photoFile);
                await client.post(`/admin/users/${res.data.id}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setParentForm(emptyParentForm);
            setPhotoFile(null);
            loadAll();
        } catch (err) { setParentFormError(firstValidationMessage(err)); }
    }

    async function deleteParent(id) {
        if (!confirm('Delete this parent account? This also unlinks all their children.')) return;
        await client.delete(`/admin/users/${id}`);
        loadAll();
    }

    async function linkChild(e) {
        e.preventDefault();
        setLinkFormError(null);
        try {
            await client.post(`/admin/students/${linkForm.student_id}/parents`, { parent_user_id: linkForm.parent_user_id });
            setLinkForm(emptyLinkForm);
            loadAll();
        } catch (err) { setLinkFormError(firstValidationMessage(err)); }
    }

    async function unlinkChild(studentId, parentId) {
        await client.delete(`/admin/students/${studentId}/parents/${parentId}`);
        loadAll();
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading parents...</div>;
    if (error) return <div className="p-8" style={{ color: '#B3452D' }}>{error}</div>;

    return (
        <>
            <PageHeader title="Parents" subtitle="Parent accounts and which students they're linked to" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard label="Parent accounts" value={parents.length} />
                    <StatCard label="Students" value={students.length} />
                </div>

                <Panel title="Parent Accounts">
                    {parentFormError && <p className="text-sm mb-3" style={{ color: '#B3452D' }}>{parentFormError}</p>}
                    <form onSubmit={addParent} className="space-y-3 mb-5 pb-5 border-b" style={{ borderColor: '#F0EEE7' }}>
                        <PhotoPicker file={photoFile} onChange={setPhotoFile} name={parentForm.name} />
                        <div className="flex flex-wrap gap-2">
                            <Input placeholder="Name" className="w-32" value={parentForm.name} onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })} />
                            <Input placeholder="Email" className="w-48" type="email" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} />
                            <Input placeholder="Password (min 8 chars)" className="w-48" type="password" value={parentForm.password} onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })} />
                            <Button type="submit">Add</Button>
                        </div>
                    </form>

                    <LedgerTable columns={['Photo', 'Name', 'Email', 'Linked children', 'Actions']}>
                        {parents.map((p) => (
                            <Row key={p.id}>
                                <Cell><Avatar src={p.profile_photo ? `http://127.0.0.1:8000/storage/${p.profile_photo}` : null} name={p.name} size={32} /></Cell>
                                <Cell className="font-medium">{p.name}</Cell>
                                <Cell style={{ color: '#6B7280' }}>{p.email}</Cell>
                                <Cell>
                                    {(childrenByParent[p.id] || []).length === 0 && <span style={{ color: '#6B7280' }}>None linked</span>}
                                    {(childrenByParent[p.id] || []).map((child) => (
                                        <span key={child.id} className="inline-flex items-center gap-1 mr-2 mb-1 text-xs px-2.5 py-1 rounded-lg" style={{ background: '#EEF1F6' }}>
                                            {child.user?.name}
                                            <button onClick={() => unlinkChild(child.id, p.id)} style={{ color: '#B3452D' }}>×</button>
                                        </span>
                                    ))}
                                </Cell>
                                <Cell><ActionButton kind="delete" onClick={() => deleteParent(p.id)}>Delete</ActionButton></Cell>
                            </Row>
                        ))}
                        {parents.length === 0 && <tr><td colSpan="5" className="py-6 text-center" style={{ color: '#6B7280' }}>No parent accounts yet.</td></tr>}
                    </LedgerTable>
                </Panel>

                <Panel title="Link a Parent to a Student">
                    {linkFormError && <p className="text-sm mb-3" style={{ color: '#B3452D' }}>{linkFormError}</p>}
                    <form onSubmit={linkChild} className="flex flex-wrap gap-2">
                        <Select value={linkForm.parent_user_id} onChange={(e) => setLinkForm({ ...linkForm, parent_user_id: e.target.value })}>
                            <option value="">Parent...</option>
                            {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Select>
                        <Select value={linkForm.student_id} onChange={(e) => setLinkForm({ ...linkForm, student_id: e.target.value })}>
                            <option value="">Student...</option>
                            {students.map((s) => <option key={s.id} value={s.id}>{s.user?.name} ({s.admission_number})</option>)}
                        </Select>
                        <Button type="submit">Link</Button>
                    </form>
                </Panel>
            </div>
        </>
    );
}
