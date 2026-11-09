import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";

export default tseslint.config(
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    rules: {
      // Promote dangerous rules to ERROR so they block the pipeline (our quality gate)
      "security/detect-eval-with-expression": "error",
      "security/detect-child-process": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-pseudoRandomBytes": "error",
    },
  },
  { ignores: ["dist/**", "node_modules/**", "coverage/**"] }
);