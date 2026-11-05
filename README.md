# IntegraIQ — Vue 3 + TypeScript

An organized Vue rewrite of the supplied **IntegraIQ Enhanced MVP HTML**, using Vite, TypeScript, Pinia and Vue Router.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open **http://localhost:5173**.

```bash
npm run typecheck
npm run test
npm run build
npm run preview
```

## Features

- Dashboard and local usage metrics; color themes and light/dark modes
- API discovery by keyword, backend host/path, gateway suffix and plain-English requirement
- Transparent local heuristic reuse advisor (no live LLM)
- API creation, operation editor, validation and duplicate warning
- OpenAPI 3.0.3 YAML generation, live preview and export
- Documentation and Markdown technical design exports
- Demo-only Git repository settings and simulated pull-request history
- Admin demo role with editable, exportable and importable TDD templates
- Sample seeded API catalog, browser-local persistence and reset

## Important demo limitations

There is **no backend service**, Git provider connection, real AI model, identity provider, production database, or APIM deployment. The role toggle is NOT secure access control. Browser localStorage is not a production database. Do not put live API secrets into the demo catalog. Connect a backend for real collaboration, audit logging, AI analysis, pull requests and deployment automation.

A copy of the supplied standalone HTML is retained at `public/original-reference.html` for comparison. The new app is implemented in Vue/TypeScript; the old file is not used as an app runtime.

## Structure

```
src/
  assets/        visual styles adapted from the supplied HTML
  components/    reusable operation editor
  data/          seeded demo APIs
  services/      discovery, OpenAPI generation, TDD rendering
  stores/        Pinia catalog, persistence and demo PRs
  types/         TypeScript domain models
  utils/         downloads and helpers
  views/         home, discovery, creation, docs, architecture, templates
  App.vue        application shell, navigation and theme controls
  main.ts        app/router setup
```

## Next production steps

1. Add a secured Java Spring Boot or Node backend and database.
2. Implement real provider auth and permissions server-side.
3. Replace local matching with a governed retrieval endpoint if required.
4. Add OpenAPI validation via a standard contract linter and real GitHub PR integration.
5. Configure APIOps workflows, secret management, audit logs and test coverage.

## GitHub Pages continuous deployment

A ready-to-use workflow is included at `.github/workflows/deploy-pages.yml`.

1. Create a GitHub repository and push the **contents of this `integraiq-vue/` directory** to its root (so `package.json` and `.github/` are at repository root).
2. Ensure the default branch is named `main`, or update the branch names in the workflow.
3. Go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Push to `main` or use **Actions → CI and Deploy to GitHub Pages → Run workflow**.
5. Once the deployment completes, use the page URL in the deployment job.

Pull requests run checks and build but **do not deploy**. Commits to `main` run tests, TypeScript checks, a Vite production build and publish `dist/`.

**URL handling:** The workflow calculates `VITE_BASE_PATH` automatically. A repository named `<owner>.github.io` uses `/` and publishes at `https://<owner>.github.io/`. Any other repository named `<repo>` uses `/<repo>/` and publishes at `https://<owner>.github.io/<repo>/`. The Vue app uses hash-mode routing (`/#/discovery`) so Pages does not need custom server fallback rules.

**Dependencies:** The supplied project did not include an npm lockfile, so this workflow uses `npm install`. For reproducible builds, run `npm install` locally, commit the resulting `package-lock.json`, and change the workflow's install command to `npm ci` (you can then add npm caching to `actions/setup-node`).

**Hosting scope:** Pages hosts the browser-only demo. It does **not** turn simulated Git operations, AI matching or API integrations into live server-side services. Avoid putting real secrets into Vite environment variables or the static site.
