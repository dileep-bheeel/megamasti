# MegaMasti

MegaMasti is a premium, no-sign-up entertainment platform with strategy, logic, knowledge, creativity and social games for a broad age range.

## Technology

- React 18 and React Router
- Vite 5
- `chess.js` for complete chess move validation
- Local, privacy-friendly progress for favorites, recently played games, preferences and personal bests
- Vercel deployment with SPA rewrites and security headers

The current public library exposes only complete game routes. Additional concepts remain internal until their mechanics and content pass review.

## Local development

```bash
npm install
npm run dev
```

No environment variables or account are required to play.

## Quality gate

```bash
npm run lint
npm run build
```

`npm run build` runs ESLint before creating the production bundle. GitHub Actions runs the same checks for every push and pull request.

## Deployment

Vercel is configured to run `npm run build`, publish `dist`, and rewrite client-side routes to `index.html`. Pushes to `main` deploy through the connected Vercel project.

## Data and privacy

Gameplay progress is stored only in the visitor's browser. This release does not require Supabase and does not collect personal data.
