// HashEdu design system v2 — Outfit font, rounded corners, hover transitions,
// roomier spacing. Same navy/brass/paper color tokens as before, friendlier shapes.

export function PageHeader({ title, subtitle }) {
    return (
        <header className="px-4 sm:px-8 py-5 sm:py-6 border-b" style={{ borderColor: '#E4E1D8', background: '#FFFFFF' }}>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }} className="text-xl sm:text-2xl">{title}</h1>
            {subtitle && <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{subtitle}</p>}
        </header>
    );
}

export function Panel({ title, action, children }) {
    return (
        <section className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: '#E4E1D8' }}>
            {(title || action) && (
                <div className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderColor: '#E4E1D8' }}>
                    {title && <h2 className="text-sm font-semibold" style={{ color: '#22262B', fontFamily: "'Outfit', sans-serif" }}>{title}</h2>}
                    {action}
                </div>
            )}
            <div className="p-4 sm:p-6">{children}</div>
        </section>
    );
}

export function StatCard({ label, value }) {
    return (
        <div className="bg-white border rounded-2xl px-5 py-5 transition-shadow hover:shadow-md" style={{ borderColor: '#E4E1D8' }}>
            <div className="text-xs font-medium" style={{ color: '#6B7280' }}>{label}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }} className="text-2xl sm:text-3xl mt-1">{value}</div>
        </div>
    );
}

export function LedgerTable({ columns, children }) {
    return (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-sm min-w-[600px] sm:min-w-0 border-separate" style={{ borderSpacing: '0 4px' }}>
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c} className="text-left py-2 px-3 font-semibold whitespace-nowrap text-xs uppercase tracking-wide" style={{ color: '#9AA0A8' }}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export function Row({ children }) {
    return (
        <tr className="transition-colors hover:bg-[#F7F6F3] group">
            {children}
        </tr>
    );
}
export function Cell({ children, className = '' }) {
    return <td className={`py-3.5 px-3 ${className}`}>{children}</td>;
}

export function Input(props) {
    return (
        <input
            {...props}
            className={`border px-3.5 py-2.5 text-sm w-full rounded-xl transition-colors focus:outline-none focus:ring-2 ${props.className || ''}`}
            style={{ borderColor: '#D8D5CB', fontFamily: "'Outfit', sans-serif", ...(props.style || {}) }}
        />
    );
}

export function Select(props) {
    return (
        <select
            {...props}
            className={`border px-3.5 py-2.5 text-sm w-full rounded-xl bg-white transition-colors focus:outline-none ${props.className || ''}`}
            style={{ borderColor: '#D8D5CB', fontFamily: "'Outfit', sans-serif" }}
        >
            {props.children}
        </select>
    );
}

export function Button({ children, variant = 'primary', ...props }) {
    const base = 'px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';
    const variants = {
        primary: { background: '#1B2A4A', color: '#fff' },
        brass: { background: '#B8860B', color: '#fff' },
        ghost: { background: 'transparent', color: '#1B2A4A', border: '1px solid #D8D5CB' },
        danger: { background: 'transparent', color: '#B3452D' },
    };
    return (
        <button
            {...props}
            style={{ ...variants[variant], fontFamily: "'Outfit', sans-serif" }}
            className={`${base} hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-none`}
        >
            {children}
        </button>
    );
}

export function ActionButton({ children, kind = 'edit', ...props }) {
    const styles = {
        edit: { color: '#1B2A4A', background: '#EEF1F6' },
        delete: { color: '#B3452D', background: '#FBEAE6' },
        confirm: { color: '#2F7D5C', background: '#E8F3EE' },
        neutral: { color: '#6B7280', background: '#F0EEE7' },
    };
    return (
        <button
            {...props}
            style={{ ...styles[kind], fontFamily: "'Outfit', sans-serif" }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all hover:opacity-80 hover:-translate-y-0.5"
        >
            {children}
        </button>
    );
}

export function Avatar({ src, name, size = 40 }) {
    const initials = (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                width={size}
                height={size}
                className="rounded-full object-cover border"
                style={{ borderColor: '#E4E1D8', width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-full flex items-center justify-center font-semibold shrink-0"
            style={{ width: size, height: size, background: '#1B2A4A', color: '#fff', fontSize: size * 0.4, fontFamily: "'Outfit', sans-serif" }}
        >
            {initials}
        </div>
    );
}

// Reusable photo picker: shows a preview circle, lets you pick a file, and
// exposes the raw File object via onChange for the parent form to send.
// Purely optional in every form that uses it — nothing breaks if skipped.
export function PhotoPicker({ file, onChange, currentUrl, name }) {
    const preview = file ? URL.createObjectURL(file) : currentUrl;
    return (
        <div className="flex items-center gap-3">
            <Avatar src={preview} name={name} size={48} />
            <label className="text-xs px-3 py-2 rounded-lg cursor-pointer transition-colors hover:opacity-80" style={{ background: '#EEF1F6', color: '#1B2A4A', fontFamily: "'Outfit', sans-serif" }}>
                {file || currentUrl ? 'Change Photo' : 'Add Photo (optional)'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
            </label>
        </div>
    );
}
