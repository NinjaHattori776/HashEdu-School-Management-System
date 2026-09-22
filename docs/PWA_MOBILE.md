# Turning HashEdu into an Installable Mobile Web App (PWA)

## What you need to install — short answer: nothing new

You already have everything required:
- **Node.js + npm** (already installed, used for the React build)
- **A modern browser** (Chrome, Safari, Edge — all support PWA install)

No new software, no new accounts, no app store fees. This is the whole point
of a PWA — it's still just a website, but a browser can offer to "install" it
so it opens full-screen from a home-screen icon like a native app.

## What's included in this package

- `public/manifest.json` — tells the browser the app's name, colors, and icon
- `public/icons/icon.svg` — the app icon (see note on iOS below)
- `public/sw.js` — a minimal service worker that caches the login page shell
  for instant repeat loads (NOT full offline mode — API calls still need network)
- `resources/js/registerServiceWorker.js` — registers the service worker
- Updated `resources/js/main.jsx` — calls the registration on app start
- `docs/BLADE_HEAD_ADDITIONS.md` — the meta tags to add to `app.blade.php`

## How to actually install it on a phone (for testing)

### On Android (Chrome)
1. Make sure your phone and computer are on the same WiFi network
2. Find your computer's local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows, look for IPv4)
3. On your phone's Chrome, visit `http://<that-ip>:8000` (e.g. `http://192.168.1.42:8000`)
4. Chrome will show an "Add to Home Screen" banner, or tap the ⋮ menu → "Add to Home Screen"
5. It now opens full-screen from your home screen icon, no browser chrome

### On iPhone (Safari)
Same steps, but: tap the Share icon → "Add to Home Screen". Safari doesn't
show an automatic install banner like Chrome does — it's always this manual step.

### Important limitation for local testing
Service workers (and full PWA install prompts) technically require HTTPS —
browsers make an exception for `localhost` specifically, but **not** for a
local network IP like `192.168.1.42`. This means:
- Testing on your own computer at `localhost:8000` → full PWA features work
- Testing on your PHONE via your computer's local IP → the manifest/icon/"Add
  to Home Screen" still works, but the service worker may be blocked by some
  browsers since it's not `localhost` or HTTPS

**To fully test on a real phone**, you'll eventually want either:
1. A real domain with HTTPS (once you deploy — see `docs/DOCKER.md` for the
   containerization half of that story), or
2. A tunneling tool like `ngrok` (`ngrok http 8000`) which gives you a
   temporary HTTPS URL pointing at your local server — good enough for
   testing before a real deployment exists

## Optional upgrade: `vite-plugin-pwa`

The manual setup above is enough to make the app installable. If you later
want more robust offline caching (actual API response caching, background
sync, update prompts when a new version is deployed), there's a well-maintained
Vite plugin for that:

```bash
npm install -D vite-plugin-pwa
```

That's a separate, more involved setup (it auto-generates the service worker
and manifest from your `vite.config.js` instead of the hand-written files
here) — worth a dedicated follow-up session if you want it, since it would
replace the manual `sw.js`/`manifest.json` approach rather than sit alongside it.

## Summary: what "shippable as a mobile web app" means here

Your users can:
- Open HashEdu in their phone's browser like any website
- Tap "Add to Home Screen" (or get prompted automatically on Android)
- Launch it from their home screen as a full-screen app with your icon and name
- Get instant repeat loads of the login shell thanks to the service worker

They CANNOT (without the native-wrapper step, which is a separate future
conversation):
- Find it in the Apple App Store / Google Play Store
- Use it fully offline (any screen that hits the API still needs a connection)
- Get push notifications (a real PWA feature, but needs additional setup not
  included here — flag it as a future session if you want it)
