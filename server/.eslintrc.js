module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['prettier'],
  rules: {
    'import/default': 0,
    'import/no-named-as-default': 0,
    'import/no-relative-packages': 'error',
    'import/no-absolute-path': 'error',
    'import/no-unresolved': [
      'error',
      {
        ignore: ['react-select/dist'],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['external', 'builtin', 'internal'],
        pathGroups: [
          {
            pattern: '@src/generated/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@src/**',
            group: 'internal',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-duplicate-imports': 'error',
  },
}
