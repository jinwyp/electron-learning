<template>
    <el-button class="select-directory" icon="el-icon-tickets" @click.stop="onFolderClick">选择目录</el-button>
</template>

<script>
const { dialog } = require('electron').remote

export default {
    name: 'TkSelectDirectory',
    model: {
        prop: 'path',
        event: 'selected',
    },
    props: {
        path: {
            type: String,
            default: '',
        },
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
            
            
            dialog.showOpenDialog(options).then( (result) => {
                console.log('TkSelectDirectory Selected filePaths: ', result.filePaths)

                if (!result.filePaths) {
                    return
                }
                const [path] = result.filePaths

                console.log('TkSelectDirectory Selected first path: ', path)
                self.$emit('selected', path)
            }).catch(err => {
                console.log('TkSelectDirectory Selected path error: ', err)
            })
        },
    },
}
</script>

<style lang="scss">
</style>
