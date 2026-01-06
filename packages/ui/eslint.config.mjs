// packages/ui/eslint.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

import baseConfig from '@hammercreative/eslint-base';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...baseConfig,
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
