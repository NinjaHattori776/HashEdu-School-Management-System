import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

// CHANGED: sessionStorage instead of localStorage — see api/client.js for why.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            return;
        }
        client.get('/me')
            .then((res) => setUser(res.data))
            .catch(() => sessionStorage.removeItem('auth_token'))
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const res = await client.post('/login', { email, password });
        sessionStorage.setItem('auth_token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
    }

    async function logout() {
        await client.post('/logout').catch(() => {});
        sessionStorage.removeItem('auth_token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
