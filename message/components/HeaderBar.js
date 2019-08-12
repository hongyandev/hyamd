define(['vue'], function (Vue) {
    return Vue.extend({
        name: 'headerBar',
        props: ['title'],
        template: 
            `<div class="header fixed bottom_border">
                <div class="header_back">
                    <img src="./images/Header_Back.png" alt="Arrow" />
                </div>
                <div class="header_content">
                    <p class="header_content_text">{{title}}</p>
                </div> 
                <div class="header_more">
                    <slot></slot>
                </div> 
            </div>`
    })
})