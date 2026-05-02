import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'coverage/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Existing repository content includes many unescaped apostrophes in JSX copy.
      'react/no-unescaped-entities': 'off',
      // Disable new React Compiler migration blockers until components are refactored.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      // Keep legacy utility component typing and CommonJS Next config unblocked.
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      // Keep signal, but do not fail CI for style-only reassignment.
      'prefer-const': 'warn',
    },
  },
];

export default eslintConfig;
