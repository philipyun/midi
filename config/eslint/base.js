const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'prettier', 'turbo'],
  plugins: ['only-warn', 'import'],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
    'dist/',
  ],
  overrides: [
    {
      files: ['*.js?(x)', '*.ts?(x)'],
    },
  ],
  rules: {
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: 'next{,/**}',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: 'react?(-*){,/**}',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: 'styled?(-*){,/**}',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: '@philipyun-midi/**',
            group: 'internal',
            position: 'before',
          },
        ],
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: { order: 'asc' },
        pathGroupsExcludedImportTypes: [],
      },
    ],
  },
};
