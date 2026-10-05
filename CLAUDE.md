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
