import axios from 'axios';

// CHANGED: sessionStorage instead of localStorage.
//
// Why: localStorage is SHARED across every tab of the same browser. If you
// logged in as a teacher in one tab and a super admin in another, both tabs
// were reading/writing the SAME 'auth_token' key — so whichever login
// happened most recently silently took over every other open tab too.
//
// sessionStorage is scoped to ONE TAB. Each tab now keeps its own
// independent session, so a teacher in tab A and a super admin in tab B stay
// logged in as themselves, permanently, in different tabs of the same browser.
// (Different browsers/devices/incognito windows already worked fine before —
// this only fixes the same-browser-different-tab case.)
const client = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

client.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
