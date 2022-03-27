module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        'require-jsdoc': 0,
        'no-unused-vars': 'warn',
        indent: [
            'error',
            4,
            {
                SwitchCase: 0,
            },
        ],
    },
}
