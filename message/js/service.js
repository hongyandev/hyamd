define(['axios','mui'], function (axios,mui) {
    function addMethod (object, name, fn) {
        // 把前一次添加的方法存在一个临时变量old中
        var old = object[name];

        // 重写object[name]方法
        object[name] = function () {
            if (fn.length === arguments.length) {
                // 如果调用object[name]方法时，如果实参和形参个数一致，则直接调用
                return fn.apply(this, arguments);
            } else if (typeof old === 'function') {
                // 如果实参形参不一致，判断old是否是函数，如果是，就调用old
                return old.apply(this, arguments);
            }
        };
    }
    let instance = axios.create({
        baseURL: 'http://dev.sge.cn/hyapp'
    });
    instance.interceptors.response.use(res=>{
        if(res.data.code!='200'){
            mui.toast(res.msg);
        }
        return res.data.data;
    }, err=>{
        return Promise.reject(err);
    });
    addMethod(this, "monthPlanDetailInit", function (func) {
        axios.get('../source/temp/zdData.json').then(res => {
           func(res);
        });
    });
    function getMonthDetail(xh) {
        return instance.get('/gzrzfb/getNewMonthPlanDetail?xh='+xh);
    }
    function getZd() {
        return axios.get('../source/temp/zdData.json');
    }
    addMethod(this, "monthPlanDetailInit", function (xh,func) {
       /* axios.get('../source/temp/zdData.json').then(res => {
            func(res);
        });*/
        axios.all([getZd(), getMonthDetail(xh)])
            .then(axios.spread(function (acct, perms) {
                // 两个请求现在都执行完成
                console.log(acct,perms);
                func(acct,perms)
            }));
    });
    var monthPlanDelete = function (xh, func) {
        instance.post('/gzrzfb/deleteNewMonthPlan',xh).then(res=>{
            func(res);
        })
    };
    var monthPlanSave = function (params, func) {
        instance.post('/gzrzfb/saveNewMonthPlan',params).then(res=>{
           func(res);
        });
    };
    var monthPlanDJDelete = function (xh,func) {
        instance.post('').then(res=>{
            func(res)
        })
    };
    var monthPlanDJSave = function (params,func) {
        instance.post('').then(res=>{
            func(res)
        })
    };
    //初次连接桥获取基本信息
    /*bridge.getBaseData(function (res) {

    });*/

    var getRankRelationship = function (params,func) {
        instance.get('/gzrzfb/rankRelationship?ygbm='+params).then(res=>{
            func(res)
        })
    };
    var getMonthLists = function (params,func) {
        instance.get('/gzrzfb/monthPlanList',{params:params}).then(res=>{
            func(res)
        })
    };
    /*var goDetail = function (params,func) {
        instance.get('/gzrzfb/getNewMonthPlanDetail?xh='+params).then(res=>{
            func(res)
        })
    }*/
    return {
        "monthPlanDetailInit" : this.monthPlanDetailInit,
        "monthPlanDelete" : monthPlanDelete,
        "monthPlanSave" : monthPlanSave,
        "monthPlanDJDelete":monthPlanDJDelete,
        "monthPlanDJSave":monthPlanDJSave,
        "getRankRelationship":getRankRelationship,
        "getMonthLists":getMonthLists,
    }
})


