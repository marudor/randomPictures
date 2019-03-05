module.exports = {
  extends: ['joblift/node'],
  env: {
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: true,
      'eslint-import-resolver-typescript': true,
    },
  },
  overrides: [
    {
      rules: {
        'no-unused-vars': 0,
      },
      files: ['src/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
    },
  ],
};
