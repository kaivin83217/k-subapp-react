module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx:true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  extends: ["react-app", "plugin:prettier/recommended"],
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  rules: {
    "prettier/prettier": [
      1,
      {
        semi: true,
        trailingComma: "all",
        tabWidth: 2,
      },
    ],
    "no-console": `off`,
    "react-hooks/rules-of-hooks": `warn`,
    "react-hooks/exhaustive-deps": `off`,
    "import/no-commonjs": "off",
  },
};
