import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await client.post('/reset-password', { email, token, password, password_confirmation: passwordConfirmation });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F6F3' }}>
            <form onSubmit={handleSubmit} className="bg-white p-8 border w-full max-w-sm space-y-4" style={{ borderColor: '#E4E1D8' }}>
                <h1 style={{ fontFamily: "'Source Serif 4', serif" }} className="text-xl">Set a new password</h1>
                <p className="text-sm" style={{ color: '#6B7280' }}>for {email}</p>
                {message && <p className="text-sm" style={{ color: '#2F7D5C' }}>{message}</p>}
                {error && <p className="text-sm" style={{ color: '#B3452D' }}>{error}</p>}
                <input className="w-full border px-3 py-2" style={{ borderColor: '#D8D5CB' }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password (min 8 characters)" required />
                <input className="w-full border px-3 py-2" style={{ borderColor: '#D8D5CB' }} type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirm new password" required />
                <button className="w-full text-white py-2" style={{ background: '#1B2A4A' }} type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                <Link to="/login" className="block text-center text-sm" style={{ color: '#6B7280' }}>Back to sign in</Link>
            </form>
        </div>
    );
}
