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
                           <text-area v-for="zd in zds" :zd="zd" :val="zd.value" :read="zd.readOnly"></text-area>
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
                  btnname:['取消','提交'],
            },
            xh:GetRequest().xh ? GetRequest().xh : "",
            state:'0'
        },
        methods: {
            zgldGetData(res){
                var self = this;
                console.info(res);
                self.zgld.record = res[0]
            },
            getData() {
                // var self = this;
                // return axios.get('../source/temp/zdData.json').then(res => {
                //     self.zds = res.data.list;
                // })
                var self = this;
                service.monthPlanDetailInit(function (res) {
                    self.zds = res.data.list_dj;
                    self.zgld.zgldData = res.data.conLists;
                    self.zgld.record = res.data.conLists[0];
                })
            },
            btnFun(res){
                service.test();
                if(res == '0'){
                    service.monthPlanDJDelete(function (res) {

                    });
                }else if(res == '1'){
                    service.monthPlanDJSave(function (res) {

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
                if(this.xh){
                    service.monthPlanDetailInit( this.xh ,function (acct,perms) {
                        // console.info(acct+','+perms);
                        self.zds = acct.data.list_dj;
                        self.zds.forEach(function (item) {
                            console.info(item);
                            item.value = perms.detial[item.field];
                        });
                    });
                }
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

