# 행샤 (HaengSha) — Collaborative Calendar & Timetable Platform

A web application for managing events, calendars, and timetables — built by [Waffle Studio](https://github.com/wafflestudio) 23.5 Team 1.

## What It Does

행샤 (HaengSha) is a collaborative calendar platform that helps users organize events and timetables in one place. It provides:

- **Multiple calendar views** — month, week, and day layouts powered by [react-big-calendar](https://github.com/jquense/react-big-calendar)
- **Timetable management** — create and manage weekly timetables alongside your calendar
- **Event search & filtering** — find events by keyword, category, or organization
- **Bookmarks & memos** — save events and attach personal notes
- **Social authentication** — sign in with Kakao, Google, or Naver (plus email signup)
- **User profiles** — customize your profile with display name and image

## Tech Stack

| Category | Tools |
|----------|-------|
| Framework | React 19, TypeScript |
| Routing | React Router DOM 7 |
| Build | Vite 7 |
| HTTP | Axios |
| Date Handling | date-fns |
| Linting & Formatting | Biome |
| Unused Code Detection | Knip |
| Deployment | AWS S3 + CloudFront |

## Getting Started

### Prerequisites

- **Node.js** ≥ 24 (see [CI config](.github/workflows/ci.yml))
- **Yarn** package manager

### Installation

```bash
git clone https://github.com/wafflestudio/23-5-team1-web.git
cd 23-5-team1-web
yarn install
```

### Development

```bash
yarn dev
```

This starts the Vite dev server with hot module replacement. The dev server proxies `/api` requests to the backend automatically (configured in `vite.config.ts`).

### Environment Variables

Create a `.env.development` file (one is already included) or set these variables for production builds:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base path for API requests (default: `/api/v1`) |
| `VITE_KAKAO_REST_API_KEY` | Kakao OAuth API key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_NAVER_CLIENT_ID` | Naver OAuth client ID |
| `VITE_KAKAO_REDIRECT_URI` | Kakao OAuth callback URL |
| `VITE_GOOGLE_REDIRECT_URI` | Google OAuth callback URL |
| `VITE_NAVER_REDIRECT_URI` | Naver OAuth callback URL |
| `VITE_REST_REQUEST_URL` | Production API endpoint |

### Build for Production

```bash
yarn build
```

The output is written to `dist/` and can be served as static files.

## Project Structure

```
src/
├── api/          # API service layer (auth, events, users, timetables)
├── contexts/     # React Context providers for global state
├── pages/        # Page components (auth, calendar, timetable, search, etc.)
├── router/       # Route definitions
├── widgets/      # Reusable UI components
├── util/         # Shared types, constants, and helpers
└── styles/       # CSS modules
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start dev server with hot reload |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build locally |
| `yarn lint` | Run Biome linter |
| `yarn check:format` | Check code formatting |
| `yarn check:unused` | Detect unused exports with Knip |
| `yarn check-all` | Run all checks (lint + unused code) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes and ensure `yarn check-all` passes
4. Open a pull request using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)

## Getting Help

- Open an [issue](https://github.com/wafflestudio/23-5-team1-web/issues) using one of the provided [issue templates](.github/ISSUE_TEMPLATE)
- Reach out to the team via [Waffle Studio](https://github.com/wafflestudio)

## Maintainers

Built and maintained by **Waffle Studio 23.5 Team 1**.
