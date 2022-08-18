module.exports = {
  extends: ['marudor/noReact'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'unicorn/prefer-module': 0,
  },
  globals: {
    PROD: false,
    SERVER: false,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['marudor/typescript'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
  ],
};
