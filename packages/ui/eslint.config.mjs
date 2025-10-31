// packages/ui/eslint.config.mjs

import path from 'path';
import { fileURLToPath } from 'url';
import reactConfig from '@chorusworks/eslint-config/react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...reactConfig,
  {
    ignores: ['*.config.*', '**/*.config.*'],
  },
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
