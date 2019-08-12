define(function () {
    require.config({
        baseUrl: "../source/js",
        paths: {
            "vue": "lib/vue",
            "zepto": "lib/zepto1.2",
            "components": "../../message/components"
        }
    });
    require(["zepto"], function () {
        require(["../../message/js/" + $("title").text()])
    })
})