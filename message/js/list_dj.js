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
                           <text-area :read="true" :zd="zblxRecord"></text-area>
                           <text-area v-for="zd in zds" :zd="zd" :val="zd.value" :read="eval(zd.readOnly)"></text-area>
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
            state:2
        },
        computed: {
            buttons:function () {
                if(this.state=="2"){
                    return [{text:'点检', edit:true}];
                }else if(this.state=="4") {
                    return [{text:'点检', edit:false}];
                }else{
                    return [{text:'点检', edit:true}];
                }
            }
        },
        methods: {
            eval(e){
                let state = this.state;
                return eval(e)
            },
            getData() {
                var self = this;
                service.monthPlanDetailInit(function (res) {
                    self.zds = res.data.list_dj;
                })
            },
            btnFun(){
                let data = {
                    xh:this.xh,
                    cyfx:this.zds.filter(val => val.field === 'cyfx')[0].value,
                };
                if(data.cyfx==''||data.cyfx==null){
                    mui.toast('差异分析不能为空',{ duration:3000, type:'div' });
                    return false;
                }
                service.monthPlanDJSave( data ,function (res) {
                     console.info(res);
                     //点检完成跳转list页面
                     mui.toast('点检成功',{ duration:3000, type:'div' });
                     service.goBridgeList();
                 });
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
                            item.value = perms.detial[item.field] ? perms.detial[item.field] : '-';
                        });
                        self.state = parseInt(perms.detial['state']);

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

