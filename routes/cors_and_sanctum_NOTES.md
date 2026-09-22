# CORS + Sanctum config (do this once)

1. In `.env`, add/update:
   ```
   SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
   SESSION_DOMAIN=localhost
   FRONTEND_URL=http://localhost:5173
   ```
   (5173 is Vite's default dev port.)

2. In `config/cors.php`, make sure:
   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'supports_credentials' => true,
   ```

We're using simple Bearer-token auth (not cookie-based SPA auth) to keep local
dev friction low — the React app stores the token from `/api/login` and sends
it as `Authorization: Bearer <token>` on every request. That means strict CORS
config matters less right now, but keep the above in place since we may switch
to cookie-based auth later for production.
