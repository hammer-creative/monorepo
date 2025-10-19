// commitlint.config.cjs
module.exports = {
  extends: ["@hmidmismi/commitlint-config"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["web", "api", "contentful", "ui", "utils", "infra", "design"],
    ],
  },
};
