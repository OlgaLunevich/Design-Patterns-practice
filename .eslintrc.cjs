module.exports = {
    env: {
        node: true,
        es2020: true,
        jest: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    settings: {
        'import/resolver': {
            typescript: {
                project: './tsconfig.json',
            },
        },
    },
    rules: {
        'import/prefer-default-export': 'off',

        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
                js: 'never',
                jsx: 'never',
            },
        ],

        // TypeScript-версии правил вместо JS-версий
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',

        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'error',
    },

};


