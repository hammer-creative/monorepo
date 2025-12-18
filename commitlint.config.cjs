// commitlint.config.cjs
module.exports = {
  rules: {
    'scope-enum': [
      2,
      'always',
      ['web', 'api', 'contentful', 'ui', 'utils', 'infra', 'design'],
    ],
  },
};
