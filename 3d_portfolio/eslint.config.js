import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Was ['**/*.{ts,tsx}'], the project has two .tsx files and ~20 .jsx
    // components, so lint ran on almost nothing and exited 0 regardless.
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // tseslint.configs.recommended turns no-undef OFF, on the assumption that
      // TypeScript catches it. These are .jsx files that tsc never sees, so an
      // undefined identifier passed lint AND vite build and only failed in the
      // browser. Turn it back on for the untyped files.
      'no-undef': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
