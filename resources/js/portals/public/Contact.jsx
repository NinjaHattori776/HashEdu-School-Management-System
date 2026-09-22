import { useState } from 'react';
import client from '../../api/client';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await client.post('/contact', form);
            setStatus(res.data.message);
            setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            const errors = err.response?.data?.errors;
            setError(errors ? Object.values(errors)[0][0] : 'Something went wrong.');
        }
    }

    return (
        <div className="px-4 sm:px-8 py-16 max-w-xl mx-auto">
            <h1 style={{ fontWeight: 800 }} className="text-3xl mb-4">Contact Us</h1>
            {status && <p className="text-sm mb-4" style={{ color: '#2F7D5C' }}>{status}</p>}
            {error && <p className="text-sm mb-4" style={{ color: '#B3452D' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3 bg-white border rounded-2xl p-6" style={{ borderColor: '#E4E1D8' }}>
                <input className="w-full border px-3.5 py-2.5 rounded-xl text-sm" style={{ borderColor: '#D8D5CB' }} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="w-full border px-3.5 py-2.5 rounded-xl text-sm" style={{ borderColor: '#D8D5CB' }} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input className="w-full border px-3.5 py-2.5 rounded-xl text-sm" style={{ borderColor: '#D8D5CB' }} placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="w-full border px-3.5 py-2.5 rounded-xl text-sm" style={{ borderColor: '#D8D5CB' }} placeholder="Subject (optional)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <textarea className="w-full border px-3.5 py-2.5 rounded-xl text-sm" style={{ borderColor: '#D8D5CB' }} rows={4} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <button className="w-full text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ background: '#1B2A4A' }} type="submit">Send</button>
            </form>
        </div>
    );
}
