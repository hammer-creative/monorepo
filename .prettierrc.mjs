// eslint/files/prettier.config.js

/** @type {import("prettier").Config} */
export default {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^styled-system/(.*)$",
    "^@chorusworks/(.*)$",
    "^~/(.*)$",
    "^[./]",
  ],
};
