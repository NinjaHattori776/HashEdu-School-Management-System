const FEATURES = [
    { icon: '📚', title: 'Academic Setup', desc: 'Classes 1–13, sections, subjects, and the academic calendar.' },
    { icon: '📝', title: 'Attendance', desc: 'Bulk daily attendance for teachers, full history for families.' },
    { icon: '📊', title: 'Exams & Marks', desc: 'Exam scheduling, bulk marks entry, instant results for students.' },
    { icon: '🏆', title: 'Report Cards', desc: 'Auto-graded, ranked, downloadable PDF report cards.' },
    { icon: '💳', title: 'Fees', desc: 'Fee structures, invoicing, and payment tracking.' },
    { icon: '📅', title: 'Notices & Timetable', desc: 'School-wide or class-specific announcements and schedules.' },
];

export default function Features() {
    return (
        <div className="px-4 sm:px-8 py-16 max-w-4xl mx-auto">
            <h1 style={{ fontWeight: 800 }} className="text-3xl mb-2 text-center">Features</h1>
            <p className="text-center mb-10" style={{ color: '#6B7280' }}>Everything a school needs, in one place.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map((f) => (
                    <div key={f.title} className="bg-white border rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: '#E4E1D8' }}>
                        <div className="text-3xl mb-2">{f.icon}</div>
                        <h3 className="font-semibold mb-1">{f.title}</h3>
                        <p className="text-sm" style={{ color: '#6B7280' }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
