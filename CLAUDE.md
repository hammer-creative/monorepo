# CLAUDE.md

pnpm + Turborepo monorepo for hammercreative.com.

## Layout

- `apps/web` — Next.js site (`@hammercreative/web`)
- `packages/sanity` — Sanity Studio and schema (`@hammercreative/sanity`)
- `packages/ui` — shared UI package built with tsup (`@hammercreative/ui`)
- `packages/tsconfig` — shared TypeScript configs (`@hammercreative/tsconfig`)
- `scripts/` — shell/node helpers (favicons, images, mux uploads, `branch-tag-commit.sh`)

## Commands

Run from the repo root unless noted.

- `pnpm install` — install deps (also runs `lefthook install` via `prepare`)
- `pnpm typecheck` — `turbo run typecheck` (runs Sanity `typegen` first; needs network access to Sanity)
- `pnpm lint` — `biome check . && oxlint .`
- `pnpm lint:fix` — `biome check --write . && oxlint --fix .`
- `pnpm format` — `biome format --write .`
- `pnpm build` — `turbo run build --force`
- `pnpm --filter @hammercreative/web dev` — run the web app
- `tsc --noEmit` inside a package — typecheck one package without typegen

## Tooling

- **Biome** (`biome.json`): formatting and import sorting only; the linter is disabled. Single quotes,
  semicolons, ES5 trailing commas, 2-space indent, 100 columns. CSS, generated files and
  `packages/sanity/sanity.types.ts` are excluded.
- **oxlint** (`.oxlintrc.json`): linting. `correctness` is `error`; React Compiler-style rules and some
  a11y rules are `warn`. `eqeqeq` allows `== null` / `!= null`. Prefix intentionally unused
  vars/args with `_`.
- **lefthook** (`lefthook.yml`):
  - `pre-commit`: biome (auto-fix, restages), oxlint, typecheck
  - `commit-msg`: commitlint
  - `prepare-commit-msg`: inserts `[branch]` after the conventional-commit prefix
  - `pre-push`: typecheck
  - `post-merge`: `pnpm install`
- ESLint, Prettier, husky and lint-staged were removed. Do not reintroduce them.

## TypeScript

Configs extend `@hammercreative/tsconfig` (`tsconfig.base.json`, `tsconfig.nextjs.json`,
`tsconfig.sanity-studio.json`). The base enables `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noUnusedLocals` and `noUnusedParameters`. Conventions that follow:

- Optional props that receive possibly-undefined values are typed `?: T | undefined`.
- Where a third-party type rejects `undefined`, use a conditional spread: `...(x && { x })`.
- Guard indexed access (`arr[0]?.x`) instead of asserting.
- `@/*` maps to `./src/*` in `apps/web` and `packages/ui`.
- `packages/sanity/sanity.types.ts` and `apps/web/src/types/sanity.generated.ts` are generated; do not
  edit them by hand.

## Commits

Conventional commits, checked by commitlint. Allowed scopes (`commitlint.config.cjs`): `web`, `api`,
`contentful`, `ui`, `utils`, `infra`, `design`. The `prepare-commit-msg` hook adds the branch name
tag, so do not type it yourself.

## Deploy

Netlify builds with `pnpm --filter @hammercreative/web build` (Node 22, pnpm 10.12.4).

## Handoff (state as of branch `chore/biome-oxlint-lefthook-tsconfig`)

### Tooling migration — done
- ESLint, Prettier, husky and lint-staged replaced by Biome, oxlint and lefthook; shared tsconfig
  package added; code reformatted and fixed for the strict tsconfig. Two commits plus this file.
- Verified: `biome check .` clean, `oxlint .` 0 errors (warnings remain), `tsc --noEmit` passes in all
  three packages.
- Not verified: `pnpm typecheck` through turbo (Sanity typegen needs network and failed with a TLS
  error in the cloud sandbox), and the lefthook hooks other than `pre-push`. Run both locally.
- Local clones that previously ran `husky install` may keep a stale `.husky/_` folder and
  `core.hooksPath=.husky`. Fix: `git config --unset core.hooksPath && rm -rf .husky && pnpm install`.
- `pnpm` ignored lefthook's build script during install. If hooks don't install, run
  `pnpm exec lefthook install` (or `pnpm approve-builds`).
- Open items: `netlify.toml` `[dev]` command uses `@hammer/web` (not a real package name);
  `apps/web/next.config.ts` still has `typescript.ignoreBuildErrors: true` and an `eslint` block that
  is now dead; `commitlint.config.cjs` scopes (`api`, `contentful`, …) don't match current packages
  (`sanity`, `tsconfig` are missing).

### Next task — Sanity Visual Editing (not started)

Goal: click-to-edit and live preview of the Next.js site inside Sanity Studio's Presentation tool.

What already exists:
- `packages/sanity/sanity.config.ts` configures `presentationTool` with
  `previewUrl.origin = SANITY_STUDIO_PREVIEW_ORIGIN || http://localhost:3000` and
  `draftMode: { enable: '/api/enable-draft', disable: '/api/disable-draft' }`. `resolve.mainDocuments`
  covers `/` (homePage) and `/work/:slug` (caseStudy); `locations` covers only `homePage` and
  `caseStudy`.
- `apps/web` depends on `next-sanity`, `@sanity/visual-editing`, `@sanity/preview-url-secret`
  (the last is in `packages/sanity`; check whether `apps/web` needs it too), and `@sanity/react-loader`
  is in `packages/sanity`.
- `apps/web/src/lib/sanity/client.ts` exports `client` (published, stega studioUrl set) and
  `draftClient` (`perspective: 'previewDrafts'`, stega enabled). Token comes from
  `SANITY_API_PREVIEW_TOKEN`.
- `apps/web/src/lib/sanity/ssr.ts` has a `loadQueryOptions` helper and commented-out
  `@sanity/react-loader` code; it is not exported from `lib/sanity/index.ts`.
- Queries live in `apps/web/src/lib/sanity/queries/` (`homePage`, `caseStudy`, `servicesPage`,
  `workPage`, `basicPage`) and fetch through `fetchSanity` in `lib/sanity/groq/helpers.ts`, which
  always uses the published `client` and `revalidate: 60`.

What is missing (verified by grep — none of this exists in `apps/web/src`):
- No `/api/enable-draft` or `/api/disable-draft` route handlers, so Presentation can't enable draft
  mode.
- `<VisualEditing />` is not rendered anywhere (layout or otherwise).
- `draftMode()` is not read by any page; pages never switch to `draftClient`.
- Studio URL mismatch: `draftClient` uses `http://localhost:3333/studio` in dev while `client` uses
  `http://localhost:3333`. Pick the one that matches how the Studio is actually served.

Suggested plan:
1. Confirm versions (`next` ^15, `next-sanity` ^11) and read the `next-sanity` docs for the matching
   API. Decide between `defineLive` (`next-sanity/live`, `SanityLive`) and the manual draft-mode +
   `VisualEditing` + `useOptimistic`/loader approach. `defineLive` is the lower-effort option if the
   installed version supports it.
2. Create a read token with Viewer rights, store as `SANITY_API_READ_TOKEN` (or reuse
   `SANITY_API_PREVIEW_TOKEN`) in Netlify and `.env.local`; never expose it to the client bundle.
3. Add `app/api/enable-draft/route.ts` (using `defineEnableDraftMode` from `next-sanity/draft-mode`
   with the token-bearing client) and `app/api/disable-draft/route.ts`.
4. Render `<VisualEditing />` from `next-sanity/visual-editing` in the root layout, only when
   `(await draftMode()).isEnabled`. Make sure it works with the existing `NavigationProvider`,
   `NextTopLoader`, and `app/template.tsx`.
5. Make `fetchSanity` (and the home/case-study/services/work/basic page queries) choose the draft
   client or `perspective: 'drafts'` + `stega: true` when draft mode is on. Keep published fetches
   cached; draft fetches must be uncached.
6. Stega strings leak into rendered text: audit places that compare or transform strings from Sanity
   (slugs, enum-like values such as `layout`, `variant`, color names, hrefs, `_type`). Use
   `stegaClean` from `next-sanity` for those, and for any value used in logic or as a `key`.
7. Extend `presentationTool.resolve`: add `mainDocuments` for `/services`, `/work`, and basic pages,
   and `locations` for `servicesPage`, `workPage`, `basicPage`, so documents show where they are
   used.
8. Check CSP/`X-Frame-Options` and `crossOrigin: 'anonymous'` in `next.config.ts` don't block the
   Studio iframe; add `frame-ancestors` for the Studio origins if headers are set.
9. Test locally (Studio on `:3333`, web on `:3000`), then on a Netlify deploy preview with
   `SANITY_STUDIO_PREVIEW_ORIGIN` set; also add the preview origin to the Sanity project's CORS
   origins with credentials allowed.
10. Run `pnpm lint`, `pnpm typecheck` and a production build before committing.

Gotchas to keep in mind:
- Strict tsconfig: `exactOptionalPropertyTypes` rejects `undefined` for optional props; use
  conditional spreads for Sanity/Next types.
- Biome only formats; lint rules come from oxlint, so run both (`pnpm lint`).
- `sanity.types.ts` and `sanity.generated.ts` are generated by `pnpm typegen`; re-run after schema
  changes (network required).

### Scope and plan for the next session (added 2026-10-07)

Build out, in this order, on a new branch cut from this one (e.g. `feat/visual-editing`):

1. Sanity Visual Editing and draft mode (steps 1-10 above).
2. Draft preview that works on any deploy: uncached draft fetches, token kept server-side, exit-preview handling.
3. Netlify preview branches: branch deploys, per-context env vars via `[context.*]` in `netlify.toml`,
   noindex on previews, and the `netlify.toml` `@hammer/web` fix from the open items.
4. Studio-to-preview wiring: `SANITY_STUDIO_PREVIEW_ORIGIN` per environment so the hosted Studio
   (`hammercreative-cms.sanity.studio`) can open a branch deploy URL.

Estimate: 5-8 hours of coding, 2-3 working days elapsed with testing.

Work the cloud container cannot do (it has no Sanity network access); do these locally:
- Create a Viewer-role Sanity read token; set it in `.env.local` and in Netlify per deploy context.
- Add CORS origins with credentials to the Sanity project for production, deploy-preview and
  branch-deploy hosts (decide on a `*.netlify.app` wildcard).
- Turn on branch deploys in Netlify.
- Run Studio on :3333 and web on :3000 and verify click-to-edit in the browser after each step.
- Run `pnpm typecheck` through turbo and the lefthook `pre-commit`/`commit-msg` hooks once.

Main risk: draft mode inside the Presentation iframe needs `SameSite=None; Secure` cookies.
`defineEnableDraftMode` from `next-sanity/draft-mode` sets this; check it first if the preview
shows published content only.

### Findings from reading the web app (2026-10-07)

- Pages (`app/page.tsx`, `services`, `work`, `work/[slug]`) and `sitemap.ts` pass the published `client`
  straight into the `getX(client)` queries, which call `sanityClient.fetch` directly. `fetchSanity`'s
  `revalidate` and tags are bypassed on that path, so draft switching has to happen where the client
  is chosen (for example one `getSanityClient()` that returns a draft client when `draftMode()` is
  enabled), not only inside `fetchSanity`.
- `getHomePage` falls back to `fetchOne('servicesPage', 'services', ...)` when no client is passed.
  That looks like a copy-paste bug; the home page should query `homePage`.
- `app/work/[slug]/page.tsx` sets `dynamic = 'force-static'`. Check that `draftMode()` still works
  there; remove it if draft content doesn't appear.
- `draftClient` uses `perspective: 'previewDrafts'`; with `next-sanity` 11.6.x prefer
  `resolvePerspectiveFromCookies` from `next-sanity/draft-mode` and `perspective: 'drafts'`.
- `next-sanity` 11.6.12 exports `./draft-mode`, `./visual-editing`, `./live`, `./hooks`, `./studio`.

### Visual editing and Studio layout

Click-to-edit outlines on the preview site and the Studio content-list order are documented in
[EDITING.md](EDITING.md). Read it before touching `apps/web/src/lib/sanity/server.ts`, the root
layout's `<VisualEditing />`, or the `structureTool` config in `packages/sanity/sanity.config.ts`.
