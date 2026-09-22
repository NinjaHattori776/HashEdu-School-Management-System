import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            const res = await client.post('/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F6F3' }}>
            <form onSubmit={handleSubmit} className="bg-white p-8 border w-full max-w-sm space-y-4" style={{ borderColor: '#E4E1D8' }}>
                <h1 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-xl">Reset your password</h1>
                <p className="text-sm" style={{ color: '#6B7280' }}>Enter your account email and we'll send you a reset link.</p>
                {message && <p className="text-sm" style={{ color: '#2F7D5C' }}>{message}</p>}
                {error && <p className="text-sm" style={{ color: '#B3452D' }}>{error}</p>}
                <input className="w-full border px-3 py-2" style={{ borderColor: '#D8D5CB' }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <button className="w-full text-white py-2" style={{ background: '#1B2A4A' }} type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
                <Link to="/login" className="block text-center text-sm" style={{ color: '#6B7280' }}>Back to sign in</Link>
            </form>
        </div>
    );
}
