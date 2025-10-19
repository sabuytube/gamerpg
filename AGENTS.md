# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives under `app/`, where `layout.js` defines the global chrome and `page.js` renders the GameRPG landing experience. Feature areas such as `game/`, `map/`, and `stats/` hold their route-specific UI; colocate supporting assets (hooks, data) beside those routes. Use `components/` for shared widgets and `lib/` for reusable utilities to keep feature folders slim. Store large static media in `public/` and reference via the `/` path at runtime.

## Build, Test, and Development Commands
- `npm run dev`: boots the local Next.js server with fast refresh at `http://localhost:3000`.
- `npm run build`: creates the production bundle and surfaces compile-time errors.
- `npm start`: serves the optimized build; run after `npm run build` for deployment smoke tests.
- `npm run lint`: executes the Next.js + ESLint ruleset; run before pushes to catch style regressions.

## Coding Style & Naming Conventions
Author React code in modern ES modules with functional components. Follow the project standard of 2-space indentation, camelCase variables/functions, and PascalCase components. Compose styling with Tailwind utility classes directly in JSX; extract repeated classsets into components or `clsx` helpers in `components/`. Keep configuration in `tailwind.config.js` and align new design tokens with existing naming.

## Testing Guidelines
A test harness is not yet wired in; prefer Jest and React Testing Library when you add coverage. Place specs beside components as `ComponentName.test.js` or inside a shared `__tests__/` folder. Target critical paths first (hooks, server actions, API routes) and aim for 80%+ coverage once the suite lands. Update the `npm test` script to run the chosen runner so CI can gate regressions.

## Commit & Pull Request Guidelines
Use conventional commits (e.g., `feat: add mage loadout panel`, `fix: correct map tooltip hover`). Keep changes scoped and include context in PR descriptions: what changed, why, screenshots or Looms for UI deltas, and any follow-up tickets. Link related issues to aid traceability, and note commands executed (`npm run dev`, `npm run build`, tests) so reviewers know your verification steps.

## Security & Configuration Tips
Inject secrets through environment variables, using `NEXT_PUBLIC_` prefixes only for values safe to ship to the browser. Document required env vars in the PR when introducing new ones, and avoid committing `.env` files. Review third-party packages before adding them; prefer in-house utilities under `lib/` when possible.
