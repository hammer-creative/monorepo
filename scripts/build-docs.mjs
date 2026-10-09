import { createRequire } from 'node:module';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Renders the editor guide in EDITING.md (everything above the "Technical notes" divider, so no env
// var or key names) to apps/web/src/app/docs/html.ts, served at /docs on the preview branch only.
// Screenshots are inlined as data URIs so nothing needs to live in public/. Run from anywhere:
// `node scripts/build-docs.mjs`.
// markdown-it is not a direct dependency (adding one would change the lockfile); this borrows the copy
// that is already in the pnpm store, so run `pnpm install` first.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const store = `${root}/node_modules/.pnpm/`;
const dir = readdirSync(store).find((d) => d.startsWith('markdown-it@'));
const require = createRequire(store + dir + '/node_modules/markdown-it/');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

// Heading ids that match GitHub's anchors, so the Contents links work here and in EDITING.md.
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, '')
    .replaceAll(' ', '-');
md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
  const text = (tokens[idx + 1]?.children ?? []).map((c) => c.content).join('');
  tokens[idx]?.attrSet('id', slug(text));
  return self.renderToken(tokens, idx, options);
};

const full = readFileSync(`${root}/EDITING.md`, 'utf8');
const guide = full.slice(0, full.indexOf('\n---\n'));
const withImages = guide
  .replace(/src="docs\/editing\/([^"]+)"/g, (_, name) => {
    const png = readFileSync(`${root}/docs/editing/${name}`).toString('base64');
    return `src="data:image/png;base64,${png}"`;
  })
  // Pointers to the developer notes make no sense on a page that does not include them.
  .replace(' Technical notes for developers are at\nthe bottom.', '')
  .replace(/ Details are in the technical notes below\./g, '')
  .replace(/ See "If the outlines don't show up" below\./, '');
const body = md.render(withImages);

const css = `
:root{color-scheme:light}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#1b1d23;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif}
main{max-width:760px;margin:0 auto;padding:40px 20px 96px}
h1{font-size:2rem;line-height:1.2;margin:0 0 .5em;border:0}
html{scroll-behavior:smooth}
h3{scroll-margin-top:16px;font-size:1.25rem;line-height:1.3;margin:1.6em 0 .5em;border:0}
h4{font-size:1.1rem;margin:1.6em 0 .5em;border:0}
h5{font-size:1rem;margin:1.4em 0 .4em;border:0}
p,ul,ol{margin:.7em 0}
li{margin:.3em 0}
a{color:#2b4bd6}
code{background:#f1f2f5;border-radius:4px;padding:.1em .35em;font:.88em ui-monospace,SFMono-Regular,Menlo,monospace}
img{max-width:100%;height:auto;border:1px solid #e3e5ea;border-radius:8px}
hr{border:0;border-top:1px solid #d9d9d9;margin:20px 0}
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<title>Editing Case Studies</title>
<style>${css}</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>
`;
writeFileSync(
  `${root}/apps/web/src/app/docs/html.ts`,
  `// apps/web/src/app/docs/html.ts
// Generated from EDITING.md (rendered with markdown-it). Regenerate when EDITING.md changes; see the
// "Hosting this guide" note in EDITING.md (node scripts/build-docs.mjs).

export const docsHtml = ${JSON.stringify(html)};
`
);
console.log('ok', html.length);
