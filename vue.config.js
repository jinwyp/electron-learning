// vue.config.js

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                extraFiles: [
                    {
                        "from": "resources/${os}",
                        "to": "Resources/bin",
                        "filter": ["**/*"]
                    }
                ]
            }
        }
    }
}
