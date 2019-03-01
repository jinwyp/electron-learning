<template>
    <el-button class="select-directory" @click.stop="onFolderClick">选择目录</el-button>
</template>

<script>
const { dialog } = require('electron').remote

export default {
    name: 'TkSelectDirectory',
    props: {
    },
    methods: {
        onFolderClick: function () {
            const self = this

            let options = {
                properties: ['openDirectory', 'noResolveAliases'],
            }
            
            /*
            dialog.showMessageBox({
                type: 'warning',
                title: '1111',
                message: '22222',
                buttons: ['ok', 'not'],
                cancelId: 1,
                checkboxLabel: 'cool'
            }, (buttonIndex, checkboxChecked) => {
                console.log(buttonIndex, checkboxChecked)
            })
            */
            
            
            dialog.showOpenDialog(options, (filePaths) => {
                console.log('filePaths: ', filePaths)
                
                if (!filePaths) {
                    return
                }
                const [path] = filePaths
                self.$emit('selected', path)
            })
        },
    },
}
</script>

<style lang="scss">
</style>
