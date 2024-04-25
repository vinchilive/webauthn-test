module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'prettier',
    'plugin:storybook/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'import/default': 0,
    'import/no-named-as-default': 0,
    'import/no-relative-packages': 'error',
    'import/no-absolute-path': 'error',
    'import/no-unresolved': ['error'],
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
            pattern: '@src/boot/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@src/utils/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@src/i18n',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@src/hooks/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@src/pages/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@src/components/**',
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
    'no-unused-vars': 'off',
    'no-duplicate-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_+$',
      },
    ],
    'no-useless-constructor': 'warn',
    'no-unused-expressions': 'warn',
    camelcase: 'error',
    'no-template-curly-in-string': 'error',
    'template-curly-spacing': 'error',
    'lines-between-class-members': [
      'warn',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    // indent: [
    //   'warn',
    //   2,
    //   {
    //     ignoredNodes: ['TemplateLiteral'],
    //     SwitchCase: 1,
    //   },
    // ],
    'object-curly-spacing': ['warn', 'always'],
    'computed-property-spacing': ['warn', 'never'],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'any', prev: 'directive', next: 'directive' },
      { blankLine: 'never', prev: 'import', next: 'import' },
    ],
    'no-return-await': 'error',
  },
}
