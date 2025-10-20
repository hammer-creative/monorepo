const path = require("path");

module.exports = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "@chorusworks/eslint-config/react",
  ],
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "build/",
    "next-env.d.ts",
    "*.config.*",
    "**/*.config.*",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: path.resolve(__dirname, "./tsconfig.json"),
      },
    },
  },
};
