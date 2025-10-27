import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'module',
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // Core rule that conflicts with TypeScript — let the TS compiler handle undefineds
      'no-undef': 'off',
      // Disable base no-unused-vars and use the TypeScript-aware rule instead
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      // Disallow use of `any` to enforce strict typing
      '@typescript-eslint/no-explicit-any': 'error',
      // Do not require explicit return types everywhere to avoid noisy warnings in small demo functions
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
])
