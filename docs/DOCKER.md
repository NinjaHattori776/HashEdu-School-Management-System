# Running HashEdu with Docker

## What's included

| Service | What it does | Port |
|---|---|---|
| `app` | PHP-FPM running Laravel | 9000 (internal) |
| `webserver` | Nginx, serves the app | **8000** (visit this) |
| `vite` | Vite dev server for React hot-reload | **5173** |
| `db` | MySQL 8 | 3306 |
| `phpmyadmin` | Database admin UI | **8080** |

## First-time setup

```bash
docker compose up -d --build
```

Wait for it to finish building (first run downloads images, takes a few
minutes), then:

```bash
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan storage:link
```

Visit **http://localhost:8000** — you should see the app running, with the
React frontend hot-reloading via the `vite` container at `localhost:5173`
(Laravel's Vite plugin automatically proxies to it in dev mode).

## Daily use

```bash
docker compose up -d        # start everything in the background
docker compose down          # stop everything
docker compose logs -f app   # watch Laravel logs
docker compose exec app bash # get a shell inside the PHP container
```

## Database access

- phpMyAdmin: http://localhost:8080 (user `root`, password `root`)
- Or directly: `docker compose exec db mysql -u root -proot hashedu`

## Running artisan commands

Prefix any `php artisan` command with `docker compose exec app`:
```bash
docker compose exec app php artisan migrate:fresh --seed
docker compose exec app php artisan tinker
```

## Production differences (not set up yet, for later)

This compose file is dev-oriented (the `vite` container runs the dev server,
not a production build). For an actual deployment:
1. Run `npm run build` to generate `public/build/`
2. Remove the `vite` service entirely
3. Update `webserver`'s nginx config to serve the built assets directly
4. Set `APP_ENV=production`, `APP_DEBUG=false` in `.env`
5. Use a managed database (RDS, PlanetScale, etc.) instead of the `db`
   container, or at minimum move `db_data` to a properly backed-up volume

That's a genuinely separate task from local Docker — flag it as a future
session if/when you're ready to actually deploy.
