const { OFF, WARN, ERROR } = {
  OFF: 0,
  WARN: 1,
  ERROR: 2,
};

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier',
  ],
  rules: {
    'max-len': [WARN, { code: 100 }],
    'react/prop-types': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/jsx-props-no-spreading': OFF,
    'import/extensions': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/jsx-filename-extension': OFF,
    'operator-linebreak': OFF,
    'no-param-reassign': [ERROR, { props: true, ignorePropertyModificationsFor: ['draft'] }],
    'no-use-before-define': [ERROR, { functions: false }],
    'no-plusplus': [ERROR, { allowForLoopAfterthoughts: true }],
  },
  overrides: [
    {
      files: ['src/scripts/**', 'jest.config.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['**.test.**', '**.spec.**'],
      env: {
        node: true,
        jest: true,
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js', '.jsx', '.json'],
        paths: ['node_modules/', 'node_modules/@types', 'src/'],
      },
    },
  },
};
