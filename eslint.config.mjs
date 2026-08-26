import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      camelcase: ["error", { properties: "never" }],

      // The Next.js TypeScript preset registers this plugin. This override
      // allows intentional unused names when they begin with an underscore.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  // Turns off formatting rules that would conflict with Prettier.
  eslintConfigPrettier,
  // Generated files are build artifacts, not source code to review.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "inspection-results/**",
  ]),
]);

export default eslintConfig;
