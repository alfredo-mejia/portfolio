import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import reactDom from "eslint-plugin-react-dom";
import reactX from "eslint-plugin-react-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      // tseslint.configs.recommended,
      // tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactRefresh.configs.recommended,
      reactRefresh.configs.next,
      reactX.configs["strict-type-checked"],
      reactDom.configs.strict,
      jsxA11y.flatConfigs.strict,
      importPlugin.flatConfigs.recommended,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "prefer-const": "error",
      "import/extensions": ["error", "ignorePackages", {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never",
      }],
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
  },
  eslintConfigPrettier,
]);
