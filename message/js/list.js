require([
    'vue',
    'axios',
    'components/textArea'
], function (Vue, axios, textArea) {
    new Vue({
        el: '#message_list',
        components: {
            'textArea':textArea
        },
        template: `<div>
                      <textArea v-for="zd in zds" :zd="zd"></textArea>
                    </div>`,
        data() {
            return{
                zds:[]
            }
        },
        methods: {
            getData() {
                var self = this;
                return axios.get('../source/temp/zdData.json').then(res => {
                    self.zds = res.data.list
                })
            }
        },
        created() {
            this.getData()
        }

    })
})