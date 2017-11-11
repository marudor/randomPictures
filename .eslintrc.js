module.exports = {
  extends: 'marudor/noReact',
  env: {
    node: true,
  },
  globals: {
  },
  plugins: ['sort-imports-es6-autofix'],
  rules: {
    'space-before-function-paren': 0,
  },
};
