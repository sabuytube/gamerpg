# Project Readiness Checklist

## Structure
- [x] Next.js App Router under `app/` with `layout.js` and entry `page.js`.
- [x] Feature routes for `game/`, `map/`, and `stats` with colocated UI.
- [x] Shared widgets in `app/components/` and gameplay utilities in `lib/game/`.
- [ ] Top-level `components/` directory for cross-route UI, as suggested by guidelines.
- [ ] `public/` directory for large static assets (create when assets ship).

## Styling & Configuration
- [x] Global stylesheet at `app/globals.css`.
- [x] Tailwind setup in `tailwind.config.js` and PostCSS config.
- [x] ESLint configuration via `.eslintrc.json` and `npm run lint`.
- [ ] Prettier or formatting config to enforce 2-space indentation automatically.

## Commands
- [x] `npm run dev`, `npm run build`, `npm start`, and `npm run lint` scripts.
- [ ] `npm test` script wired to an actual test runner.

## Testing
- [ ] Jest + React Testing Library (or alternative) installed.
- [ ] Test files (`*.test.js` or `__tests__/`) committed.
- [ ] Coverage target and reporting in CI or docs.

## Documentation
- [x] Contributor guide (`AGENTS.md`) with project conventions.
- [ ] Repository overview `README.md` for quick onboarding.
- [ ] `.env.example` documenting required environment variables.

## DevOps & Quality
- [ ] CI workflow (e.g., GitHub Actions) to lint/test on push.
- [ ] Automated dependency or security checks.
- [ ] Release/deployment notes or scripts beyond `next start`.
