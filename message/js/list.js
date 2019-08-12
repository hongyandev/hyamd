require([
    'vue',
    'components/HeaderBar'
], function (Vue, headerBar) {
    new Vue({
        el: '#message_list',
        components: {
            'header-bar':headerBar
        },
        template: `<div>
            <!--以下为公共头部-->
            <header-bar title="消息列表">
                <p class="header_more_text">筛选</p>
            </header-bar>
          </div>`
    })
})