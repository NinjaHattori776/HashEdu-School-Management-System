# Roadmap of Topics for Future Chats

When you start a new chat about this project, paste your GitHub repo link (or
this file's content, or the whole `docs/` folder) so the new session has
context without you re-explaining everything. Here's a roadmap of the kinds
of questions worth bringing to future sessions, organized by what's actually
settled vs. still open.

## Things already decided (check `docs/memory.md` before asking again)

- Why Sanctum token-based auth instead of session/cookie auth
- Why sessionStorage instead of localStorage (multi-tab fix)
- The "Academic Ledger" → HashEdu design evolution and why
- The snake_case/camelCase JSON key gotcha
- Why `updateOrCreate` is used instead of `create` for resubmittable actions

## Things you might reasonably ask about next

**Scaling & production readiness**
- How would this handle 1,000+ concurrent students? (Indexing, query
  optimization, caching layer — none of this exists yet, it's dev-scale only)
- Should the stateless-Bearer-token auth move to a proper refresh-token flow
  for production, instead of a single long-lived token?
- Rate limiting on the API — not yet configured beyond Laravel's defaults

**Feature gaps still open**
- No admin screen for viewing Contact-form enquiries (backend exists, no UI)
- `ExamController::index` for teachers isn't filtered server-side to their
  own classes — works, but is a security tightening item
- No bulk CSV import for students (admission is one-at-a-time)
- No SMS/email notifications for attendance or fee due dates

**Testing**
- Zero automated tests exist yet (no PHPUnit/Pest backend tests, no
  frontend tests). Worth a dedicated session if you want test coverage
  before treating this as production-ready.

**Deployment**
- Docker setup exists (`docs/DOCKER.md`) but hasn't been deployed to a real
  host yet — a future session on actually deploying to a VPS/cloud provider
  would be a good next step once local Docker is confirmed working.
- HTTPS/SSL setup for a real domain (needed for the PWA install-to-homescreen
  feature to fully work — see `docs/PWA_MOBILE.md`)

**Mobile**
- The web app is now installable as a PWA — a future session on wrapping it
  as a genuinely native app (React Native, Capacitor, etc.) instead of a PWA
  is a bigger, separate conversation if you want app-store presence.

## How to start a new chat efficiently

Paste one of these:
1. Your GitHub repo URL (once pushed) — "here's my project: [link], I want to..."
2. This file plus `docs/memory.md` — gives decision history without the repo
3. Just `docs/architecture.md` — if the question is narrowly about how
   something is structured, not the full history

Whichever you paste, name the SPECIFIC thing you want next — "add CSV import
for students" gets a much faster, better answer than "what's next" once a
fresh session has no memory of this conversation's back-and-forth.
