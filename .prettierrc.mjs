/** @type {import("prettier").Config} */
export default {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  importOrder: [
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '^styled-system/(.*)$',
    '^@hammercreative/(.*)$',
    '^~/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};
