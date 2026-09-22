import { Link } from 'react-router-dom';

// A hand-drawn-style classroom illustration (kids, chalkboard, books) built
// as inline SVG shapes using the HashEdu palette — no external image request.
function ClassroomIllustration() {
    return (
        <svg viewBox="0 0 500 320" className="w-full max-w-md mx-auto">
            <rect x="20" y="20" width="460" height="280" rx="24" fill="#EEF1F6" />
            {/* chalkboard */}
            <rect x="60" y="50" width="180" height="110" rx="10" fill="#1B2A4A" />
            <path d="M85,90 h60 M85,110 h100 M85,130 h40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            <rect x="55" y="160" width="190" height="10" rx="4" fill="#B8860B" />
            {/* stack of books */}
            <rect x="270" y="140" width="90" height="18" rx="3" fill="#B3452D" />
            <rect x="275" y="122" width="90" height="18" rx="3" fill="#2F7D5C" />
            <rect x="268" y="104" width="90" height="18" rx="3" fill="#B8860B" />
            {/* graduate character */}
            <circle cx="150" cy="230" r="26" fill="#F0C29B" />
            <rect x="128" y="252" width="44" height="45" rx="14" fill="#1B2A4A" />
            <polygon points="125,215 150,203 175,215 150,224" fill="#22262B" />
            <line x1="150" y1="224" x2="150" y2="236" stroke="#22262B" strokeWidth="3" />
            <circle cx="150" cy="238" r="3" fill="#B8860B" />
            {/* second character */}
            <circle cx="360" cy="235" r="24" fill="#D9A066" />
            <rect x="340" y="255" width="40" height="40" rx="14" fill="#2F7D5C" />
            <path d="M340,220 q20,-20 40,0" stroke="#22262B" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* floating icons */}
            <text x="410" y="70" fontSize="28">✏️</text>
            <text x="60" y="270" fontSize="24">📘</text>
            <text x="420" y="200" fontSize="22">⭐</text>
        </svg>
    );
}

export default function Home() {
    return (
        <div className="px-4 sm:px-8 py-12 sm:py-20 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="text-center md:text-left">
                    <h1 style={{ fontWeight: 800 }} className="text-3xl sm:text-5xl mb-4">
                        Where <span style={{ color: '#B8860B' }}>learning</span> meets
                        organized school life.
                    </h1>
                    <p className="text-base sm:text-lg mb-6" style={{ color: '#6B7280' }}>
                        Attendance, marks, report cards, and fees — one friendly place
                        for admins, teachers, students, and parents.
                    </p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        <Link to="/features" className="px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ background: '#1B2A4A' }}>
                            Explore Features
                        </Link>
                        <Link to="/contact" className="px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:-translate-y-0.5" style={{ borderColor: '#D8D5CB', color: '#1B2A4A' }}>
                            Get in Touch
                        </Link>
                    </div>
                </div>
                <ClassroomIllustration />
            </div>
        </div>
    );
}
