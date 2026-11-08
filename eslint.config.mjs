import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // --- DevSecOps: security rules ---
  security.configs.recommended,
  {
    rules: {
      // Promote dangerous rules to ERROR so they block commits and the pipeline (quality gate)
      "security/detect-eval-with-expression": "error",
      "security/detect-child-process": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-pseudoRandomBytes": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
