module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        loose: false,
        useBuiltIns: 'entry',
        modules: 'commonjs',
      },
    ],
    'babel-preset-joblift',
  ],
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
          },
        ],
        'babel-preset-joblift',
      ],
    },
  ],
};
