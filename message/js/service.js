define(['axios','mui'], function (axios) {
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
    let instance = axios.create({});
    instance.interceptors.response.use(res=>{
        if(res.code!='200'){
            mui.toast(res.msg);
        }
        return res;
    }, err=>{
        return Promise.reject(err);
    });
    addMethod(this, "monthPlanDetailInit", function (func) {
        axios.get('../source/temp/zdData.json').then(res => {
           func(res);
        });
    })
    addMethod(this, "monthPlanDetailInit", function (xh, func) {
        axios.get('../source/temp/zdData.json').then(res => {
            func(res);
        });
    })
    return {
        "monthPlanDetailInit" : this.monthPlanDetailInit
    }
})


