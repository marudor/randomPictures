module.exports = {
  plugins: [],
  overrides: [
    {
      test: ['./src/**/*.ts'],
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
        'babel-preset-joblift',
      ],
    },
  ],
};
