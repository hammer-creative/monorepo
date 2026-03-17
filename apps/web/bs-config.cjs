// apps/web/bs-config.cjs

module.exports = {
  proxy: 'localhost:3000',
  port: 3001,
  open: false,
  notify: false,
  ui: false,
  ghostMode: {
    scroll: true,
    clicks: false,
    forms: false,
  },
  snippetOptions: {
    ignorePaths: ['**/_next/**'],
  },
};
