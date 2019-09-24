define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'textArea',
        props: {
            zd: {
                type: Object,
                required: true
            },
            read:Boolean,
            show:Boolean
        },
        template:
            `<div class="mui-content"  v-show="show">
                <div class="mui-content-padded">
                    <p v-html="compTitle">{{compTitle}}</p>
                </div>
                <div class="mui-input-row mui-border">
                     <textarea :id="zd.field" :readOnly="read" :rows="zd.rows"  :placeholder="zd.placeholder" v-model="zd.value"></textarea>
                </div>
            </div>`,
        computed: {
            compTitle: function () {
                //console.log('state:'+this.$parent.state);
                console.info(this.$parent.zdjs);
                if(!this.$props.read){
                    return this.zd.title + '<span class="redSpan"> (必填项)</span>';
                }else{
                    return this.zd.title
                }
            }
        }
    })
})