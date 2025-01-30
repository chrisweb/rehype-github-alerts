import eslintPlugin from '@eslint/js'
import tseslint, { configs as tseslintConfigs } from 'typescript-eslint'
import stylisticPlugin from '@stylistic/eslint-plugin'

// currently an mts file until I find types
// for all imported packages

const eslintConfig = [
    {
        name: 'custom/eslint/recommended',
        files: ['**/*.ts'],
        ...eslintPlugin.configs.recommended,
    },
]

const ignoresConfig = [
    {
        name: 'custom/eslint/ignores',
        // the global ignores must be in it's own config object
        ignores: [
            'dist/',
            'examples/',
            'test/',
        ]
    },
]

const tseslintConfig = tseslint.config(
    {
        name: 'custom/typescript-eslint/recommended',
        files: ['**/*.ts'],
        extends: [
            ...tseslintConfigs.strictTypeChecked,
            ...tseslintConfigs.stylisticTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.url,
                warnOnUnsupportedTypeScriptVersion: true,
            },
        },
        rules: {
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-expect-error': 'allow-with-description',
                    'ts-ignore': 'allow-with-description',
                    'ts-nocheck': false,
                    'ts-check': false,
                    'minimumDescriptionLength': 3,
                },
            ],
        },
    },
    {
        // disable type-aware linting on JS files
        // only needed if you use TypeChecked rules
        files: ['**/*.mjs'],
        ...tseslintConfigs.disableTypeChecked,
        name: 'custom/typescript-eslint/disable-type-checked',
    },
)

const stylisticConfig = [
    {
        name: 'custom/stylistic/recommended',
        files: ['**/*.ts'],
        // no files for this config as we want to apply it to all files
        plugins: {
            '@stylistic': stylisticPlugin,
        },
        rules: {
            // this removes all legacy rules from eslint, typescript-eslint and react
            ...stylisticPlugin.configs['disable-legacy'].rules,
            // this adds the recommended rules from stylistic
            ...stylisticPlugin.configs['recommended-flat'].rules,
            // custom rules
            // https://github.com/typescript-eslint/typescript-eslint/issues/1824
            '@stylistic/indent': ['warn', 4],
            '@stylistic/quotes': ['warn', 'single', { avoidEscape: true, allowStringLiterals: true }],
            '@stylistic/semi': ['warn', 'never'],
            '@stylistic/eol-last': 'off',
            '@stylistic/comma-dangle': ['warn', 'only-multiline'],
            '@stylistic/padded-blocks': 'off',
            '@stylistic/spaced-comment': 'off',
            '@stylistic/multiline-ternary': ['warn', 'always-multiline', { ignoreJSX: false }],
            '@stylistic/arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }],
            '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
            '@stylistic/operator-linebreak': ['warn', 'after'],
            '@stylistic/no-multiple-empty-lines': ['warn'],
            '@stylistic/no-trailing-spaces': ['warn'],
        },
    }
]

const config = [
    ...ignoresConfig,
    ...eslintConfig,
    ...tseslintConfig,
    ...stylisticConfig,
];

export default config