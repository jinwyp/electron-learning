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
        }],
        
        "vue/max-attributes-per-line": ["error", {
            "singleline": 20,
            "multiline": {
                "max": 20,
                "allowFirstLine": true
            }
        }],

        "vue/name-property-casing": ["off", "PascalCase"],



        "vue/singleline-html-element-content-newline": ["off", {
            "ignoreWhenNoAttributes": true,
            "ignoreWhenEmpty": true,
            "ignores": ["pre", "textarea"]
        }],

        "vue/multiline-html-element-content-newline": ["off", {
            "ignoreWhenEmpty": true,
            "ignores": ["pre", "textarea"]
        }],

        "vue/multiline-html-element-content-newline": ["off", {
            "ignoreWhenEmpty": true,
            "ignores": ["pre", "textarea"]
        }],

        "vue/no-v-html": 'off',
        "vue/require-default-prop": 'off',
        

    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
