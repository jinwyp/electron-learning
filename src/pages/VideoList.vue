<template>
    <div >
        <b-button type="submit" variant="primary" @click="onSubmit">搜索</b-button>
        <b-table striped hover :items="videoList" :fields="fields">
        </b-table>
    </div>
</template>

<script>
import db from '../database/index'

export default {
    components: {},
    data() {
        return {
            fields: [
                { key: 'id', label: 'ID', sortable: false},
                { key: 'doc.title', label: 'Title', sortable: false},
                { key: 'doc.url', label: 'Url', sortable: false},
            ],
            videoList: [],
            items: [
                { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
            ]
            
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Vue Component created: ')
        db.videos.allDocs({include_docs: true}).then( (result) => {
            console.log(result);
            this.videoList = result.rows
            
            console.log(this.videoList)
        })

    },
    methods: {
        onSubmit () {
            console.log('------');
            db.videos.allDocs({include_docs: true}).then( (result) => {
                console.log(result);
                this.videoList = result.rows
            })
        },
    }
}
</script>
