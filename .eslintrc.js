module.exports = {
  root: true,
  extends: ["plugin:vue/recommended", "@vue/prettier", "@vue/typescript"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": [
      "error",
      {
        bracketSpacing: false,
        trailingComma: "es5",
      },
    ],
  },
};
