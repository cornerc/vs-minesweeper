module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
    "@vue/prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  env: {browser: true, node: true},
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        bracketSpacing: false,
        trailingComma: "es5",
      },
    ],
  },
};
