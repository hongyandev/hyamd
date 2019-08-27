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
                           <input type="hidden" id="zblx"/> 
                           <text-area v-for="zd in zds" :isReadOnly="true" :zd="zd" :val="zd.value" ></text-area>
                      </div>
                      <nav-bar :btnName="btnData.btnname" @btnclick="btnFun"></nav-bar>  
                   </div>`,
        data:{
              zds:[],
              selData:[],
              zgld:{
                  record:{
                      value:'',
                      text:'',
                  },
                  zgldData:[]
              },
            btnData:{
                  btnname:['保存'],
            },
            xh:GetRequest().xh ? GetRequest().xh : ""
        },
        methods: {
            zgldGetData(res){
                var self = this;
                console.info(res);
                self.zgld.record = res[0]
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
                    wcqk:this.zds.filter(val => val.field === 'wcqk')[0].value,
                    py:this.zds.filter(val => val.field === 'py')[0].value,
                    jjfa:this.zds.filter(val => val.field === 'jjfa')[0].value
                };
                if(data.wcqk==''||data.wcqk==null){
                    mui.toast('完成情况不能为空',{ duration:3000, type:'div' });
                    return false;
                }
                if(data.py==''||data.py==null){
                    mui.toast('差异分析不能为空',{ duration:3000, type:'div' });
                    return false;
                }
                if(data.jjfa==''||data.jjfa==null){
                    mui.toast('解决方案不能为空',{ duration:3000, type:'div' });
                    return false;
                }
                service.monthPlanDJSave( data ,function (res) {
                     console.info(res);
                     //点检完成跳转list页面

                 });
            }
        },
        created() {
            this.getData();
        },
        mounted(){
            this.$nextTick(function () {
                let self = this;
                service.monthPlanDetailInit( this.xh ,function (acct,perms) {
                        self.zds = acct.data.list_dj;
                        self.zds.forEach(function (item) {
                            item.value = perms.detial[item.field];
                        });
                    self.zds.filter(val => val.field === 'zblx')[0].value = perms.detial['n_zblx'];
                    $("#wcqk,#py,#jjfa").removeAttr('readonly');
                });
            })
        }

    })
});
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

