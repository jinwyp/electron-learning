<template>
    <div class="title-bar">
        <div class="title-bar-dragger"></div>
        <ul v-if="showActions" class="window-actions">
            <li @click="handleMinimize">
                <mo-icon name="win-minimize" width="12" height="12" />
            </li>
            <li @click="handleMaximize">
                <mo-icon name="win-maximize" width="12" height="12" />
            </li>
            <li @click="handleClose">
                <mo-icon name="win-close" width="12" height="12" />
            </li>
        </ul>
    </div>
</template>

<script>

import { remote } from 'electron'

import '@/components/icons/win-minimize'
import '@/components/icons/win-maximize'
import '@/components/icons/win-close'

export default {
    name: 'mo-title-bar',
    props: {
        showActions: {
            type: Boolean,
        },
    },
    computed: {
        win: function () {
            return remote.getCurrentWindow()
        },
    },
    methods: {
        handleMinimize: function () {
            this.win.minimize()
        },
        handleMaximize: function () {
            if (this.win.isMaximized()) {
                this.win.unmaximize()
            } else {
                this.win.maximize()
            }
        },
        handleClose: function () {
            this.win.close()
        },
    },
}
</script>
