require(['vue', 'components/textArea', 'components/picker','components/dtpicker','components/navBar','service'],
    function (Vue, textArea, picker, dtpicker ,navBar, service) {
    new Vue({
        el: '#message_list',
        components: {
            'text-area':textArea,
            'picker-input':picker,
            'dtpicker':dtpicker,
            'nav-bar':navBar
        },
        template: `<div>
                      <div class="content">
                          <text-area v-for="zd in zds" :zd="zd" :val="zd.value" :key="zd.filed"></text-area>
                          <div class="mui-content">
                              <h5 class="mui-content-padded">主办人</h5>
                              <div class="mui-border">
                                 <button class="mui-btn mui-btn-block" @click="cbrData" type='button'></button>
                              </div>
                          </div>
                          <picker-input id="showUserPicker" title="直管领导" @comclick="zgldGetData" :record="zgld.record" :dataResouce="zgld.zgldData"></picker-input>
                          <dtpicker id="stardate" title="预计开始时间" @changeTime="kssjVal"  :record="kssj.record"></dtpicker>  
                          <dtpicker id="enddate" title="预计结束时间" @changeTime="jssjVal"  :record="jssj.record"></dtpicker>  
                      </div>
                      <nav-bar :btnName="btnData.btnname" @btnclick="btnFun"></nav-bar>  
                   </div>`,
        data:{
              zds:[],
              selData:[],
              zgld:{
                  record:{
                      field:'dfld',
                      value:'',
                      text:'',
                  },
                  zgldData:[]
              },
              kssj:{
                  record:{
                      field:'kssj',
                      value:'',
                      text:'',
                  }
              },
              jssj:{
                  record:{
                      field:'yjwc',
                      value:'',
                      text:'',
                  }
               },
              btnData:{
                      btnname:['删除','保存'],
                },
              ygbm:"",
              state:"0",
              xh:GetRequest().xh ? GetRequest().xh : "",
              ly:GetRequest().ly ? GetRequest().ly : ""
        },
        methods: {
            cbrData(){

            },
            zgldGetData(res){
                var self = this;
                console.info(res);
                self.zgld.record = res[0]
            },
            kssjVal(res){
                var self = this;
                console.info(res);
                self.kssj.record.value = self.kssj.record.text = res
            },
            jssjVal(res){
                var self = this;
                console.info(res);
                self.jssj.record.value = self.jssj.record.text = res
            },
            getData() {
                var self = this;
                service.monthPlanDetailInit(function (res) {
                    self.zds = res.data.list;

                  /*  //来自月计划详情
                    let xh =  GetRequest().xh;
                    if(xh){
                        let detail = JSON.parse(localStorage.getItem("detail"));
                        var result = {};
                        this.zds.forEach(function (item) {
                            result[item.filed] = item.value;

                        });
                        console.info(result);
                    }*/
                })
            },
            btnFun(res){
                if(res == '0'){
                    console.info(this.xh);
                    console.info(this.btnData.btnname[0]);
                    let params = {
                        xh:this.xh
                    };
                    if(this.xh){
                        service.monthPlanDelete(params ,function (data) {
                            console.info(data);
                            //页面跳转列表

                        });
                    }

                }else if(res == '1'){
                    let data={
                        zblx:'1',
                        hlzb:this.zds.filter(val => val.field === 'hlzb')[0].value,
                        gznr:this.zds.filter(val => val.field === 'gznr')[0].value,
                        lastwcqk:this.zds.filter(val => val.field === 'lastwcqk')[0].value,
                        lastpy:this.zds.filter(val => val.field === 'lastpy')[0].value,
                        lastjjfa:this.zds.filter(val => val.field === 'lastjjfa')[0].value,
                        yysmb:this.zds.filter(val => val.field === 'yysmb')[0].value,
                        ygznr:this.zds.filter(val => val.field === 'ygznr')[0].value,
                        xdfa:this.zds.filter(val => val.field === 'xdfa')[0].value,
                        cbr:'11753',
                        dfld:this.zgld.record.value,
                        kssj:this.kssj.record.value,
                        yjwc:this.jssj.record.value,
                        ygbm:'00791'

                    };
                    service.monthPlanSave(data,function (res) {
                        console.info(JSON.stringify(data));
                        console.info(res);
                    });
                }
            },
        },
        created() {
            /*self = this;
            bridge.getData(data,function () {

            })*/

            this.getData();
            function Appendzero(obj){
                if(obj<10) return "0" +""+ obj;
                else return obj;
            };
            //初始化时间
            var now = new Date();
            var year = now.getFullYear() + "";
            var month = (now.getMonth() + 1) + "";
            var begin = year + "-" + Appendzero(month)+ "-" + "01";
            console.info(begin);
            var lastDateOfCurrentMonth = new Date(year,Appendzero(month),0);
            var end = year + "-" + Appendzero(month) + "-" + lastDateOfCurrentMonth.getDate();
            console.info(end);
            this.kssj.record = {"text":begin,"value":begin};
            this.jssj.record = {"text":end,"value":end};
        },
        mounted(){
            this.$nextTick(function () {
                var self = this;
                var ygbm = '00791';
                service.getRankRelationship(ygbm,function (data) {
                    self.$set(self.zgld, "zgldData", data.sjld.map(item=>{return {text: item.ygxm,value: item.ygbm}}));
                    self.$set(self.zgld, "record", data.sjld.filter(sjld => sjld.mr === '1').map(item=>{return{text:item.ygxm,value:item.ygbm}})[0]);
                });
                //来自月计划的详情
                /*let xh = GetRequest().xh;
                let ly = GetRequest().ly;*/
                if(this.xh && this.ly){
                    //回显月计划的内容
                    service.monthPlanDetailInit( this.xh ,function (acct,perms) {
                       // console.info(acct+','+perms);
                            self.zds = acct.data.list;
                            self.zds.forEach(function (item) {
                                console.info(item);
                                item.value = perms.detial[item.field];
                            });

                        });
                    self.state = '0';
                    self.xh = '';
                }
                //新增 删除btn delete
                if(this.state=='0' && this.xh==''){
                    $("nav a").first().hide();
                }else{
                    $("nav a").first().show();
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
