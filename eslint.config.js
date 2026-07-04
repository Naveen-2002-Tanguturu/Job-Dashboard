import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',   // vanilla JS loaded via <script> tags
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        history: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        MutationObserver: 'readonly',

        // Project globals (defined across script tags)
        JOBS_DATA: 'readonly',
        CATEGORIES: 'readonly',
        Storage: 'readonly',
        Render: 'readonly',
        UI: 'readonly',
        getJobById: 'readonly',
        getFeaturedJobs: 'readonly',
        filterJobs: 'readonly',
        buildFilters: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off',
      'semi': ['warn', 'always'],
      'eqeqeq': ['warn', 'always'],
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-duplicate-case': 'error',
      'no-unreachable': 'error',
    },
  },
];
