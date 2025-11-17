## Social Console

Full-stack productivity wall for sharing weekly posts, lightweight comments, and a team bio. Laravel powers the JSON API while a Vite-powered React client renders the single-page experience.

### Highlights

- Post CRUD with cover image, author attribution, and optional publish timestamp
- Inline comment threads on every post with edit/delete controls
- Editable team bio (display name, avatar, location, website)
- SQLite + Eloquent factories for instant demo data
- Axios-powered React dashboard with optimistic toasts and responsive layout

### Tech Stack

- **Backend**: PHP 8.2+, Laravel 12, SQLite
- **Frontend**: React 18, Vite 7, date-fns, custom CSS
- **Tooling**: Composer 2.9, npm 10+, PHPUnit 11

## Getting Started

### 1. Prerequisites

- PHP ≥ 8.2 with `ext-sqlite` enabled
- Composer ≥ 2.6
- Node.js ≥ 18 (ships with npm ≥ 10)

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Environment

```bash
cp .env.example .env
php artisan key:generate
```

SQLite is configured by default (`database/database.sqlite`). Feel free to swap in MySQL/Postgres by updating `.env`.

### 4. Database

```bash
php artisan migrate --seed
```

Seeding creates demo posts, comments, and the profile card so the UI has content immediately.

### 5. Run the app

Use separate terminals so logs stay readable:

```bash
php artisan serve
npm run dev
```

Visit `http://127.0.0.1:8000` for the React interface (the API lives under `/api`).

### 6. Production build & tests

```bash
npm run build
php artisan test
```

## Project Structure

- `app/Http/Controllers/*` — API endpoints for posts, comments, and profile
- `app/Http/Resources/*` — JSON transformers consumed by the SPA
- `resources/js` — React application (components, services, entry point)
- `resources/views/app.blade.php` — shell view that boots the SPA
- `database/*` — migrations, factories, and seeders for demo data

## Next Steps

- Add authentication (Sanctum) if you need per-user authorship
- Swap SQLite for a managed database in production
- Deploy the bundled assets via Laravel Vapor, Forge, or your preferred host

Happy shipping!
# php-status-feed-app
