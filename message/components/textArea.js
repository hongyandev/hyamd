define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'textArea',
        props: {
            zd: {
                type: Object,
                required: true
            }
        },
        template:
            `<div class="mui-content">
                <div class="mui-content-padded">
                    <p>{{zd.title}}</p>
                </div>
                <div class="mui-input-row" style="margin: 10px 5px;">
                        <textarea :placeholder="zd.placeholder"></textarea>
                </div>
            </div>`
    })
})