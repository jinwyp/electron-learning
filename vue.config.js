// vue.config.js

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                chainWebpackMainProcess: config => {
                    config.target('electron-renderer')
                    // Chain webpack config for electron main process only
                },
                chainWebpackRendererProcess: config => {
                    // Chain webpack config for electron renderer process only
                    // The following example will set IS_ELECTRON to true in your app
                    config.target('electron-renderer')
                },
                
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
