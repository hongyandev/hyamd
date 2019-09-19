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
                    <p>{{zd.title}}</p>
                </div>
                <div class="mui-input-row mui-border">
                     <textarea :id="zd.field" :readOnly="read" :rows="zd.rows"  :placeholder="zd.placeholder" v-model="zd.value"></textarea>
                </div>
            </div>`
    })
})