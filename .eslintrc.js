module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: [
    "@nuxtjs",
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "unicorn/number-literal-case": "off",
    "no-unused-vars": "warn",
    "no-lone-blocks": "warn",
    "prefer-const": "warn",
    "no-unused-expressions": "warn",
    "no-undef": 0,
  },
  ignorePatterns: ["fb-sdk.js"],
}
