define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'picker',
        props:{
            title: String,
            id: String,
            /*alId: String,*/
            record: {
                type: Object
            }
        },
        template:
            `<div class="mui-content">
                <h5 class="mui-content-padded">{{title}}</h5>
                <div style="margin: 10px 5px;">
                    <button :id="id" class="mui-btn mui-btn-block" type='button' :val="record.value">{{record.text}}</button>
                    <div class="ui-alert"></div>
                </div>
                
            </div>`
    })
})