const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  {
    ignores: [
      'android/**',
      'ios/**',
      '.expo/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  ...expoConfig,
];
