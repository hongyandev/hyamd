define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'navBar',
        props: {
            'btnName':Array
        },
        template: 
            `<nav class="mui-bar mui-bar-tab">
                <a type="button" :class="{edit:item.edit}" v-for="(item,index) in btnName" class="mui-tab-item mui-btnColor" @click="btnClick(index, item)">
                    {{item.text}}
                </a>
            </nav>`,
        methods:{
            btnClick: function (index, item) {
                if (!item.edit)
                    return;
                let self = this;
                self.$emit('btnclick', index);
            }
        }
    })
})