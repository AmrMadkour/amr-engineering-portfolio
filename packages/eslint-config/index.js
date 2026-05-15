/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals"],
  plugins: ["@typescript-eslint"],
  rules: {
    // Enforce explicit return types on exported functions
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Disallow unused variables (warn, not error, during dev)
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // Prefer const
    "prefer-const": "error",
    // No console.log in committed code
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};
