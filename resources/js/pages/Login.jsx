import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { schoolDoodlesBackground } from '../assets/school-doodles';

const PORTALS = [
    { key: 'admin', label: 'Admin', roles: ['admin', 'super_admin'], home: '/admin/students' },
    { key: 'teacher', label: 'Teacher', roles: ['teacher'], home: '/teacher/attendance' },
    { key: 'student', label: 'Student', roles: ['student'], home: '/portal/attendance' },
    { key: 'parent', label: 'Parent', roles: ['parent'], home: '/portal/attendance' },
];

function homeFor(role) {
    if (role === 'super_admin') return '/super-admin/academic-setup';
    const portal = PORTALS.find((p) => p.roles.includes(role));
    return portal?.home || '/login';
}

export default function Login() {
    const [portal, setPortal] = useState('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const user = await login(email, password);
            const selected = PORTALS.find((p) => p.key === portal);
            if (!selected.roles.includes(user.role)) {
                await logout();
                setError(`This account isn't a ${selected.label} account. Try a different portal.`);
                return;
            }
            navigate(homeFor(user.role));
        } catch (err) {
            setError('Invalid credentials.');
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: `#F7F6F3 url("${schoolDoodlesBackground}") repeat` }}
        >
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center text-2xl mb-2" style={{ background: '#1B2A4A' }}>
                        🎓
                    </div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }} className="text-2xl" >HashEdu</h1>
                    <p className="text-xs" style={{ color: '#6B7280' }}>School Management System</p>
                </div>

                <div className="flex mb-0 border rounded-t-2xl overflow-hidden" style={{ borderColor: '#E4E1D8', borderBottom: 'none' }}>
                    {PORTALS.map((p) => (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => setPortal(p.key)}
                            className="flex-1 py-2.5 text-xs sm:text-sm transition-colors"
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                background: portal === p.key ? '#1B2A4A' : '#FFFFFF',
                                color: portal === p.key ? '#FFFFFF' : '#6B7280',
                                borderRight: p.key !== 'parent' ? '1px solid #E4E1D8' : 'none',
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border rounded-b-2xl shadow-sm space-y-4" style={{ borderColor: '#E4E1D8' }}>
                    {error && <p className="text-sm" style={{ color: '#B3452D' }}>{error}</p>}
                    <input
                        className="w-full border px-3.5 py-2.5 rounded-xl text-sm"
                        style={{ borderColor: '#D8D5CB', fontFamily: "'Outfit', sans-serif" }}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        className="w-full border px-3.5 py-2.5 rounded-xl text-sm"
                        style={{ borderColor: '#D8D5CB', fontFamily: "'Outfit', sans-serif" }}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button
                        className="w-full text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: '#1B2A4A', fontFamily: "'Outfit', sans-serif" }}
                        type="submit"
                    >
                        Sign in
                    </button>
                    <Link to="/forgot-password" className="block text-center text-sm" style={{ color: '#6B7280' }}>
                        Forgot password?
                    </Link>
                </form>
            </div>
        </div>
    );
}
