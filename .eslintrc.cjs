module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    overrides: [
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    root: true,
    rules: {
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'never',
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                'selector': 'interface',
                'format': [
                    'PascalCase'
                ],
                'custom': {
                    'regex': '^I[A-Z]',
                    'match': true
                },
            }
        ],
    },
}