module.exports = {
  comments: false,
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        loose: false,
        useBuiltIns: 'entry',
        modules: 'commonjs',
        corejs: 3,
      },
    ],
  ],
  plugins: [],
};
