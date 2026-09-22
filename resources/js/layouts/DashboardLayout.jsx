import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NAV_BY_ROLE = {
    super_admin: [
        { section: 'Academics', items: [
            { to: '/super-admin/academic-setup', label: 'Academic Setup' },
            { to: '/super-admin/exam-setup', label: 'Exam Setup' },
            { to: '/super-admin/report-cards', label: 'Report Cards' },
        ]},
        { section: 'People', items: [
            { to: '/admin/students', label: 'Students' },
            { to: '/admin/teachers', label: 'Teachers' },
            { to: '/admin/parents', label: 'Parents' },
        ]},
        { section: 'Operations', items: [
            { to: '/admin/fees', label: 'Fees' },
            { to: '/admin/notices', label: 'Notices' },
            { to: '/admin/timetable', label: 'Timetable' },
            { to: '/super-admin/analytics', label: 'Analytics' },
        ]},
    ],
    admin: [
        { section: 'People', items: [
            { to: '/admin/students', label: 'Students' },
            { to: '/admin/teachers', label: 'Teachers' },
            { to: '/admin/parents', label: 'Parents' },
        ]},
        { section: 'Operations', items: [
            { to: '/admin/fees', label: 'Fees' },
            { to: '/admin/notices', label: 'Notices' },
            { to: '/admin/timetable', label: 'Timetable' },
            { to: '/admin/analytics', label: 'Analytics' },
        ]},
    ],
    teacher: [
        { section: 'Classroom', items: [
            { to: '/teacher/attendance', label: 'Attendance' },
            { to: '/teacher/marks', label: 'Marks Entry' },
        ]},
        { section: 'School', items: [
            { to: '/portal/notices', label: 'Notices' },
            { to: '/portal/timetable', label: 'Timetable' },
            { to: '/teacher/analytics', label: 'Analytics' },
        ]},
    ],
    student: [
        { section: 'My Records', items: [
            { to: '/portal/attendance', label: 'Attendance' },
            { to: '/portal/marks', label: 'Marks' },
            { to: '/portal/report-cards', label: 'Report Cards' },
            { to: '/portal/fees', label: 'Fees' },
        ]},
        { section: 'School', items: [
            { to: '/portal/notices', label: 'Notices' },
            { to: '/portal/timetable', label: 'Timetable' },
        ]},
    ],
    parent: [
        { section: 'My Children', items: [
            { to: '/portal/attendance', label: 'Attendance' },
            { to: '/portal/marks', label: 'Marks' },
            { to: '/portal/report-cards', label: 'Report Cards' },
            { to: '/portal/fees', label: 'Fees' },
        ]},
        { section: 'School', items: [
            { to: '/portal/notices', label: 'Notices' },
        ]},
    ],
};

function roleLabel(role) {
    return { super_admin: 'Super Admin', admin: 'Admin', teacher: 'Teacher', student: 'Student', parent: 'Parent' }[role] || role;
}

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const groups = NAV_BY_ROLE[user?.role] || [];
    const [mobileOpen, setMobileOpen] = useState(false);

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    const sidebarContent = (
        <>
            <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: '#B8860B' }}
                    >
                        🎓
                    </div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }} className="text-white text-lg leading-tight">
                        HashEdu
                    </div>
                </div>
                <button className="md:hidden text-white/70 text-xl leading-none" onClick={() => setMobileOpen(false)}>×</button>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
                {groups.map((group) => (
                    <div key={group.section}>
                        <div className="px-3 mb-2 text-xs text-white/40 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{group.section}</div>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-3 py-2.5 text-sm rounded-xl transition-all ${
                                            isActive
                                                ? 'text-white'
                                                : 'text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-0.5'
                                        }`
                                    }
                                    style={({ isActive }) => ({
                                        background: isActive ? 'rgba(184,134,11,0.25)' : undefined,
                                        fontFamily: "'Outfit', sans-serif",
                                    })}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                            {group.items.length === 0 && (
                                <div className="px-3 py-2 text-sm text-white/30 italic">Coming soon</div>
                            )}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-white/10">
                <div className="px-2 mb-2">
                    <div className="text-white text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{user?.name}</div>
                    <div className="text-white/50 text-xs">{roleLabel(user?.role)}</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    Sign out
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex" style={{ background: '#F7F6F3', fontFamily: "'Outfit', sans-serif" }}>
            <aside className="hidden md:flex w-64 shrink-0 flex-col" style={{ background: '#1B2A4A' }}>
                {sidebarContent}
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col" style={{ background: '#1B2A4A' }}>
                        {sidebarContent}
                    </aside>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b" style={{ borderColor: '#E4E1D8' }}>
                    <button onClick={() => setMobileOpen(true)} className="text-2xl leading-none" style={{ color: '#1B2A4A' }}>☰</button>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }} className="text-sm">HashEdu</div>
                    <div className="w-6" />
                </div>
                <Outlet />
            </div>
        </div>
    );
}
