module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
    ],
    rules: {
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                singleQuote: true,
                printWidth: 120,
            },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/mustache-interpolation-spacing': ['error', 'always'],
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/html-indent': ['error', 4],
        indent: ["error", 4, {"SwitchCase": 1}],
        'vue/match-component-file-name': [
            'error',
            {
                extensions: ['vue'],
                shouldMatchCase: false,
            },
        ],
    },
    env: {
        node: true,
        'vue/setup-compiler-macros': true,
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    ignorePatterns: ['**/utils/ckeditor'],
    globals: {
        NodeJS: true,
    },
};
