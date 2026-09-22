// Call this once from main.jsx after the app renders. Registers the service
// worker so the app becomes installable ("Add to Home Screen" on mobile).
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.warn('Service worker registration failed:', err);
            });
        });
    }
}
