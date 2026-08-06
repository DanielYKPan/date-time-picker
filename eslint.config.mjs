import eslint from "@eslint/js";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/no-deprecated": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/consistent-generic-constructors": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@angular-eslint/prefer-inject": "warn",
      "no-empty": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@angular-eslint/no-empty-lifecycle-method": "warn",
      "@typescript-eslint/class-literal-property-style": "warn",
      "@angular-eslint/prefer-on-push-component-change-detection": "warn",
      "@angular-eslint/prefer-standalone": "warn",
      "prefer-rest-params": "warn",
      "no-prototype-builtins": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/consistent-indexed-object-style": "warn",
      "@angular-eslint/no-input-rename": "warn",
      "no-useless-assignment": "warn",
      "@angular-eslint/no-output-native": "warn",
      "@typescript-eslint/array-type": "warn",
      "@typescript-eslint/ban-tslint-comment": "warn",
      "no-self-assign": "warn",
      "no-useless-escape": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/no-autofocus": "warn",
      "@angular-eslint/template/interactive-supports-focus": "warn"
    },
  },
);
