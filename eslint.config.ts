import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig(
  { ignores: ["dist/"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      // @ts-expect-error -- react-hooks plugin types don't align with ESLint 10's Plugin type yet
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  eslintConfigPrettier,
);
