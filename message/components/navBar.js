define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'navBar',
        props: {
            'btnName':Array
        },
        template: 
            `<nav class="mui-bar mui-bar-tab">
                <a v-for="(item,index) in btnName" class="mui-tab-item mui-btnColor" href="javascript:void(0)" @click="btnClick(index)">
                    {{item}}
                </a>
            </nav>`,
        methods:{
            btnClick: function (index) {
                let self = this;
                self.$emit('btnclick', index);
            }
        }
    })
})