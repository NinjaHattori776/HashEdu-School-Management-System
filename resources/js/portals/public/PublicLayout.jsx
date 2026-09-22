import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function PublicLayout() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F3', fontFamily: "'Outfit', sans-serif" }}>
            <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b" style={{ borderColor: '#E4E1D8' }}>
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: '#1B2A4A' }}>🎓</div>
                    <span style={{ fontWeight: 800 }} className="text-lg">HashEdu</span>
                </Link>
                <nav className="hidden sm:flex gap-6 text-sm font-medium" style={{ color: '#22262B' }}>
                    <Link to="/" className="hover:text-[#1B2A4A]">Home</Link>
                    <Link to="/about" className="hover:text-[#1B2A4A]">About</Link>
                    <Link to="/features" className="hover:text-[#1B2A4A]">Features</Link>
                    <Link to="/contact" className="hover:text-[#1B2A4A]">Contact</Link>
                </nav>
                <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background: '#1B2A4A' }}
                >
                    Sign In
                </button>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="px-4 sm:px-8 py-6 text-center text-xs bg-white border-t" style={{ borderColor: '#E4E1D8', color: '#6B7280' }}>
                © {new Date().getFullYear()} HashEdu — School Management System
            </footer>
        </div>
    );
}
