// /Users/j/Documents/projects/hammer/monorepo/apps/web/eslint.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import nextPlugin from '@next/eslint-plugin-next';

import reactConfig from '@hammercreative/eslint-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.netlify/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      'next-env.d.ts',
      '*.config.*',
      '**/*.config.*',
    ],
  },
  ...reactConfig,

  // Next.js rules via plugin (ESLint 9 flat-config friendly)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
    settings: {
      next: {
        rootDir: __dirname,
      },
    },
  },

  // TS + resolver settings
  {
    languageOptions: {
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, './tsconfig.json'),
        },
      },
    },
  },
];
