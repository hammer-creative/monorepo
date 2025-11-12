// apps/web/eslint.config.mjs

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import reactConfig from '@chorusworks/eslint-config/react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FlatCompat helps bridge Next.js configs to flat config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'build/',
      'next-env.d.ts',
      '*.config.*',
      '**/*.config.*',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...reactConfig,
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
