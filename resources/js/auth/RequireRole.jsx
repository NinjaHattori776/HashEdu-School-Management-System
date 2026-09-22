import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Usage: <RequireRole roles={['super_admin']}><AcademicSetup /></RequireRole>
export default function RequireRole({ roles, children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <div className="p-8 text-red-600">Forbidden — wrong role.</div>;

    return children;
}
