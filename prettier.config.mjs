const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleAttributePerLine: true,
  printWidth: 80,
  endOfLine: "lf",
  // Tailwind CSS v4 entry stylesheet so the formatter can sort custom utilities
  tailwindStylesheet: "./app/globals.css",
  plugins: [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-classnames",
    // Merge must be last so both Tailwind sorting & classname wrapping apply
    "prettier-plugin-merge",
  ],
};

export default config;
