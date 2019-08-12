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
                      <textArea v-for="zd in zds" :placeholder="zd.placeholder" :title="zd.title"></textArea>
                    </div>`,
        data(){
            return{
                zds:[]
            }
        },
        created(){
            var self = this;
            return axios.get('../source/temp/zdData.json')
                .then(function (res) {
                    console.info(res.data);
                    self.zds = res.data
                })
                .catch(function (error) {
                    self.fetchError = error
             })
        }

    })
})