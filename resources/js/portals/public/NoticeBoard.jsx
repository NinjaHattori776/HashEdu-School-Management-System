import { useEffect, useState } from 'react';
import client from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { PageHeader, Panel, Input, Select, Button } from '../../components/ui';

const AUDIENCE_LABEL = { all: 'Everyone', students: 'Students', teachers: 'Teachers', parents: 'Parents', class: 'One Class' };

export default function NoticeBoard() {
    const { user } = useAuth();
    const canManage = ['admin', 'super_admin'].includes(user?.role);
    const [notices, setNotices] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ title: '', body: '', audience: 'all', school_class_id: '' });

    async function loadAll() {
        setLoading(true);
        try {
            const requests = [client.get('/notices')];
            if (canManage) requests.push(client.get('/super-admin/school-classes').catch(() => ({ data: [] })));
            const [n, c] = await Promise.all(requests);
            setNotices(n.data);
            if (c) setClasses(c.data);
        } catch (err) { setError('Failed to load notices.'); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadAll(); }, []);

    async function addNotice(e) {
        e.preventDefault();
        try {
            await client.post('/admin/notices', form);
            setForm({ title: '', body: '', audience: 'all', school_class_id: '' });
            loadAll();
        } catch (err) { setError(err.response?.data?.message || 'Failed to post notice.'); }
    }
    async function deleteNotice(id) {
        if (!confirm('Delete this notice?')) return;
        await client.delete(`/admin/notices/${id}`);
        loadAll();
    }

    if (loading) return <div className="p-8" style={{ color: '#6B7280' }}>Loading notices...</div>;

    return (
        <>
            <PageHeader title="Notices" subtitle="School announcements" />
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                {error && <p className="text-sm" style={{ color: '#B3452D' }}>{error}</p>}
                {canManage && <Panel title="Post a Notice"><form onSubmit={addNotice} className="space-y-2"><Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><textarea placeholder="Message" className="border px-3 py-2 text-sm w-full" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /><div className="flex flex-wrap gap-2"><Select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="w-48"><option value="all">Everyone</option><option value="students">Students</option><option value="teachers">Teachers</option><option value="parents">Parents</option><option value="class">One Class</option></Select>{form.audience === 'class' && <Select value={form.school_class_id} onChange={(e) => setForm({ ...form, school_class_id: e.target.value })} className="w-48"><option value="">Select class...</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>}<Button type="submit">Post</Button></div></form></Panel>}
                <Panel title="All Notices">{notices.length === 0 && <p style={{ color: '#6B7280' }}>No notices yet.</p>}<div className="space-y-4">{notices.map((n) => <div key={n.id} className="border-b pb-4 last:border-0"><div className="flex justify-between items-start"><div><div className="font-medium">{n.title}</div><div className="text-xs" style={{ color: '#6B7280' }}>{AUDIENCE_LABEL[n.audience]}{n.school_class ? ` — ${n.school_class.name}` : ''} · {n.publisher?.name} · {new Date(n.published_at).toLocaleDateString()}</div></div>{canManage && <button onClick={() => deleteNotice(n.id)} className="text-xs" style={{ color: '#B3452D' }}>Delete</button>}</div><p className="text-sm mt-2">{n.body}</p></div>)}</div></Panel>
            </div>
        </>
    );
}
