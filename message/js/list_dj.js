require(['vue', 'components/textArea', 'components/picker','components/navBar','service'],
    function (Vue, textArea, picker, navBar, service) {
    new Vue({
        el: '#message_list',
        components: {
            'text-area':textArea,
            'picker-input':picker,
            'nav-bar':navBar
        },
        template: `<div>
                      <div class="content">
                           <text-area :read="true" :show="true" :zd="zblxRecord"></text-area>
                           <text-area :show="show(zd.show)" v-for="zd in zds" :zd="zd" :val="zd.value" :read="eval(zd.readOnly)"></text-area>
                      </div>
                      <nav-bar :btnName="buttons" @btnclick="btnFun"></nav-bar>  
                   </div>`,
        data:{
            zblxRecord:{
                "title":"指标类型",
                "rows":1,
                "placeholder":"请输入指标类型",
                "field" : "zbms",
                "value" : ""
            },
            zds:[],
            selData:[],
            xh:getQueryVariable('xh') ? getQueryVariable('xh') : "",
            state:2,
            zblx:'',
            zdjs:0
        },
        computed: {
            buttons:function () {
                if(this.state=="2"){
                    return [{text:'撤销点检', edit: false},{text:'点检', edit:true}];
                }else if(this.state=="4") {
                    return [{text:'撤销点检', edit: true},{text:'点检', edit:false}];
                }
            }
        },
        methods: {
            eval(e){
                let state = this.state,
                    zdjs = this.zdjs;
                return eval(e)
            },
            show(e){
                let zblx = this.zblx;
                return eval(e)
            },
            getData() {
                var self = this;
                service.monthPlanDetailInit(function (res) {
                    self.zds = res.data.list_dj;
                })
            },
            btnFun(res){
                if(res == '0'){
                    let param = new URLSearchParams();
                    param.append("xh", this.xh);
                    service.monthPlanDJCancle(param ,function (res) {
                        console.info(res);
                        //点检完成跳转list页面
                        mui.toast('取消点检成功',{ duration:3000, type:'div' });
                        service.goBridgeList();
                    });
                }else{
                    let data = {
                        xh:this.xh,
                        cyfx:this.zds.filter(val => val.field === 'cyfx')[0].value,
                        ygznr:this.zds.filter(val => val.field === 'ygznr')[0].value,
                        ywcqk:this.zds.filter(val => val.field === 'ywcqk')[0].value,
                    };
                    if(data.cyfx==''||data.cyfx==null){
                        mui.toast('差异分析不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(isNotANumber(data.ygznr)){
                        if(!isNotANumber(data.ywcqk) || data.ywcqk==''){
                            mui.toast('月完成值不能为空且必须为数字！',{ duration:3000, type:'div' });
                            return false;
                        }
                    }
                    service.monthPlanDJSave( data ,function (res) {
                        console.info(res);
                        //点检完成跳转list页面
                        mui.toast('点检成功',{ duration:3000, type:'div' });
                        service.goBridgeList();
                    });
                }

            }
        },
        created() {
            this.getData();
        },
        mounted(){
            this.$nextTick(function () {
                let self = this;
                service.monthPlanDetailInit( self.xh ,function (acct,perms) {
                        self.zds = acct.data.list_dj;
                        self.zblxRecord.value = perms.detial['zbms'];
                        self.zds.forEach(function (item) {
                            //item.value = perms.detial[item.field] ? perms.detial[item.field] : '-';
                            item.value = perms.detial[item.field]
                        });
                        self.state = parseInt(perms.detial['state']);
                        self.zblx = perms.detial['zblx'];
                        self.zdjs = parseInt(perms.detial['zdjs'])

                });
            })
        }

    })
});
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function isNotANumber(inputData) {
    //isNaN(inputData)不能判断空串或一个空格
    //如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
    if (parseFloat(inputData).toString() == 'NaN') {
        //alert(“请输入数字……”);
        return false;
    } else {
        return true;
    }
}