define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'textArea',
        props: ['title','placeholder'],
        template:
            `<div class="mui-content">
                <div class="mui-content-padded">
                    <p>{{title}}</p>
                </div>
                <div class="mui-input-row" style="margin: 10px 5px;">
                        <textarea :placeholder="placeholder"></textarea>
                </div>
            </div>`
    })
})