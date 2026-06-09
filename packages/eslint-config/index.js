/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals", "plugin:sonarjs/recommended-legacy"],
  plugins: ["@typescript-eslint", "sonarjs"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prefer-const": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    // Tune sonarjs rules to practical levels for this codebase
    "sonarjs/cognitive-complexity": ["warn", 20],
    "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }]
  }
};
