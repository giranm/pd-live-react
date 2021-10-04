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
    "plugin:react/recommended",
    "airbnb",
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "prettier"
  ],
  rules: {
    "react/prop-types": OFF,
    "react/jsx-one-expression-per-line": OFF,
  },
  overrides: [
    {
      files: ["src/scripts/**", "jest.config.js"],
      env: {
        node: true,
      },
    },
    {
      files: ["**.test.**", "**.spec.**"],
      env: {
        node: true,
        jest: true,
      },
    },
  ],
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["src", "./src"],
        ],
        extensions: [".ts", ".js", ".jsx", ".json"],
      },
    },
  },
};
