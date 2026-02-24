// apps/web/postcss.config.mjs

import { DEFAULT_COLORS } from '@hammercreative/ui';

export default {
  plugins: {
    'postcss-import': {
      path: ['src/styles'],
    },
    'postcss-mixins': {},
    'postcss-simple-vars': {
      variables: {
        ...Object.fromEntries(
          Object.entries(DEFAULT_COLORS).map(([key, value]) => [
            `color-${key}`,
            value,
          ]),
        ),
      },
    },
    'postcss-nested': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
    '@lehoczky/postcss-fluid': {},
    autoprefixer: {},
  },
};
