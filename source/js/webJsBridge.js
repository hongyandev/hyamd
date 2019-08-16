function connectWebViewJavascriptBridge(callback) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    // Android
    if (isAndroid) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener(
                "WebViewJavascriptBridgeReady",
                function () {
                    callback(WebViewJavascriptBridge);
                },
                false
            );
        }
    }

    // iOS
    if (isiOS) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }

        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }

        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement("iframe");
        WVJBIframe.style.display = "none";
        WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
}

// 调试log信息输出控制
// 0x00-disable, 0x1X-native, 0x2X-web
// 0xX1-error, 0xX2-warn, 0xX4-debug, 0xX8-info, 0xXF-all
var wvjbEnableNativeLog = 0x08;

var wbjsBridge = wbjsBridge || {};
(function (wbjsBridge) {
    if (wbjsBridge.method){
        console.warn("wbjsBridge.method is already defined.");
        return;
    }

    wbjsBridge.method = wbjsBridge.method || {};
    connectWebViewJavascriptBridge(function (bridge) {
        /**
         * 注册方法
         */
        bridge.registerHandler("", function (data, responseCallBack) {

        });

        wbjsBridge.method.bridge = bridge;
    });
})(wbjsBridge);


wbjsBridge.method.getBaseData = function (params, funcCallback) {
    wbjsBridge.method.bridge.callHandler("getBaseData", params, function (response) {
       console.info('getBaseData got response: ', response);

       if (typeof funcCallback == "function"){
           funcCallback(response);
       }
    });
};


function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return (
            '"' +
            o
                .replace(/([\'\"\\])/g, "\\$1")
                .replace(/(\n)/g, "\\n")
                .replace(/(\r)/g, "\\r")
                .replace(/(\t)/g, "\\t") +
            '"'
        );
    }

    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]));
            }

            if (
                !!document.all &&
                !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(
                    o.toString
                )
            ) {
                r.push("toString:" + o.toString.toString());
            }

            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]));
            }

            r = "[" + r.join() + "]";
        }

        return r;
    }

    return o.toString();
}

(function (window, undefined) {
    if (0 !== (wvjbEnableNativeLog & 0x1f)) {
        var uniqueId = 1;

        console = new Object();
        console.log = function () {
            var logString = "";
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == "object") {
                    logString += obj2string(arguments[i]);
                } else {
                    logString += arguments[i];
                }
            }

            if (wvjbEnableNativeLog & 0x10) {
                var iframe = document.createElement("IFRAME");
                iframe.setAttribute("src", "wvjblog:#JSBRIDGE#" + logString);
                document.documentElement.appendChild(iframe);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            } else if (wvjbEnableNativeLog & 0x20) {
                var logEle = document.getElementById("log");
                if (logEle) {
                    var el = document.createElement("div");
                    el.className = "logLine";
                    el.innerHTML = "(" + uniqueId++ + "). " + logString + "<br/><hr>";

                    if (logEle.children.length) {
                        logEle.insertBefore(el, logEle.children[0]);
                    } else {
                        logEle.appendChild(el);
                    }
                }
            }
        };

        console.info = function () {
            if (wvjbEnableNativeLog & 0x08) {
                console.log.apply(this, arguments);
            }
        };

        console.debug = function () {
            if (wvjbEnableNativeLog & 0x04) {
                console.log.apply(this, arguments);
            }
        };

        console.warn = function () {
            if (wvjbEnableNativeLog & 0x02) {
                console.log.apply(this, arguments);
            }
        };

        console.error = function () {
            if (wvjbEnableNativeLog & 0x01) {
                console.log.apply(this, arguments);
            }
        };

        console.trace = function () {
            if (wvjbEnableNativeLog & 0x10) {
                console.log.apply(this, arguments);
            }
        };
    }

    bridge = wbjsBridge.method;
})(window);