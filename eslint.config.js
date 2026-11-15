import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      '.vercel/',
      'node_modules/',
      'assets-originais/',
      'playwright-report/',
      'test-results/',
      '.lighthouseci/',
    ],
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
];
