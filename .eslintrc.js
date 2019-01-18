module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/recommended',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "indent": ["error", 4],
        "comma-dangle": ["error", "always-multiline"],
        "no-multiple-empty-lines": ["error", { "max": 6, "maxEOF": 2 }],
        "no-trailing-spaces": ["error", { "skipBlankLines": true }],

        
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],

        "vue/max-attributes-per-line": [10, {
            "singleline": 10,
            "multiline": {
                "max": 10,
                "allowFirstLine": true
            }
        }],

        "vue/html-self-closing": ["error", {
            "html": {
                "void": "never",
                "normal": "any",
                "component": "any"
            },
            "svg": "always",
            "math": "always"
        }],

        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "never"
        }]

    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
