# HashEdu — School Management System

A multi-portal school management system built with Laravel (API backend) and
React (SPA frontend). One login-gated system, five role-specific portals:
Super Admin, Admin, Teacher, Student, Parent.

<p align="center">
  <img alt="Laravel" src="https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">
</p>

## Features

- **Academic Setup** — academic years, classes 1–13, sections, subjects
- **People** — students (with admission + guardian info + optional photo),
  teachers, parents, and parent-to-student linking
- **Attendance** — teacher bulk-marks a class/section/date; student/parent
  view history
- **Exams & Marks** — exam types, exams, per-subject max/pass marks, teacher
  bulk marks entry, student/parent marks view
- **Report Cards** — auto-computed percentage/grade/class-rank per exam,
  downloadable PDF
- **Fees** — fee categories, structures, invoice generation, payment tracking
- **Notices & Timetable** — audience-targeted announcements, weekly schedule
- **Analytics** — attendance/pass/fee-collection stats per role
- **Public site** — Home/About/Features/Contact, no login required
- **Forgot password** flow with email reset links
- Fully responsive (mobile/tablet/desktop)

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel (PHP), MySQL |
| Frontend | React 18 + Vite, React Router v6, Axios |
| Auth | Laravel Sanctum (token-based) |
| Styling | Tailwind CSS + custom design tokens |
| PDF generation | barryvdh/laravel-dompdf |
| Font | Outfit (Google Fonts) |

## Getting Started (Local Development)

### Prerequisites
- PHP 8.2+, Composer
- Node.js 18+, npm
- MySQL (via XAMPP, MAMP, or standalone)

### Setup

```bash
git clone https://github.com/<your-username>/hashedu.git
cd hashedu

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:
```
DB_DATABASE=hashedu
DB_USERNAME=root
DB_PASSWORD=
```

```bash
php artisan migrate
php artisan db:seed --class=SchoolStructureSeeder
php artisan storage:link
```

Run both servers in separate terminals:
```bash
php artisan serve       # backend, :8000
npm run dev              # frontend, :5173
```

Visit `http://127.0.0.1:8000` — you'll be redirected to `/login`.

**Default super admin login** (from the seeder):
- Email: `superadmin@school.test`
- Password: `password`

## Project Structure

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown —
folder layout, request lifecycle, entity relationships (with diagrams).

## Documentation

This project keeps a `docs/` folder as its living reference — read these
before making changes:

| File | Purpose |
|---|---|
| [`docs/prd.md`](docs/prd.md) | What this is, who it's for, feature list |
| [`docs/architecture.md`](docs/architecture.md) | Tech stack, folder structure, diagrams |
| [`docs/rules.md`](docs/rules.md) | Conventions, gotchas, contribution rules |
| [`docs/design.md`](docs/design.md) | Colors, fonts, component library |
| [`docs/tasks.md`](docs/tasks.md) | Feature status, phase by phase |
| [`docs/memory.md`](docs/memory.md) | Decision log and bug history |
| [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md) | How to commit and push changes |
| [`docs/DOCKER.md`](docs/DOCKER.md) | Running this with Docker |
| [`docs/PWA_MOBILE.md`](docs/PWA_MOBILE.md) | Installing as a mobile web app |

## Running with Docker

```bash
docker compose up -d --build
docker compose exec app php artisan migrate --seed
```
See [`docs/DOCKER.md`](docs/DOCKER.md) for full details.

## Contributing / Committing Changes

See [`docs/GIT_WORKFLOW.md`](docs/GIT_WORKFLOW.md) for the one-command
commit-and-push workflow used on this project.

## License

MIT
