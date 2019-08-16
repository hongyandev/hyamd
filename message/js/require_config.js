define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "vue": "lib/vue",
            "bridge": "webJsBridge",
            "zepto": "lib/zepto1.2",
            "axios": "lib/axios",
            "mui": "lib/mui",
            "picker": "plugin/mui.picker",
            "poppicker": "plugin/mui.poppicker",
            "components": "../../message/components",
            "service": "../../message/js/service"
        },
        shim:{
            "picker":{
                deps:["mui"]
            },
            "poppicker":{
                deps:["mui"]
            }
        }
    });
    require(["zepto", "bridge", "axios"], function () {
        require(["../../message/js/" + $("title").text()])
    })
})