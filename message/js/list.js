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
                          <input type="hidden" id="zblx"/>
                          <text-area :read="true" :show="true" :zd="zblxRecord"></text-area>
                          <text-area v-for="zd in zds" :zd="zd" :val="zd.value" :show="show(zd.show)" :read="eval(zd.readOnly)"></text-area>
                          <picker-input id="showCbrPicker" title="主办人" @comclick="zgldGetData" :record="cbr.record" :dataResouce="cbr.cbrData"></picker-input>
                          <picker-input id="showUserPicker" :isHidden="true" title="直管领导" @comclick="zgldGetData" :record="zgld.record" :dataResouce="zgld.zgldData"></picker-input>
                          <dtpicker id="stardate" title="预计开始时间" @changeTime="kssjVal"  :record="kssj.record"></dtpicker>  
                          <dtpicker id="enddate"  title="预计结束时间" @changeTime="jssjVal"  :record="jssj.record"></dtpicker>  
                      </div>
                      <nav-bar :btnName="buttons" @btnclick="btnFun"></nav-bar>
                   </div>`,
        data:{
              zblxRecord:{
                "title":"指标类型",
                "rows":1,
                "placeholder":"请输入指标类型",
                "field" : "zbms",
                "value" : "其它重点工作项"
              },
              zblx:'9',
              zbms:'',
              zds:[],
              selData:[],
              zgld:{
                  record:{
                      value:'',
                      text:'',
                  },
                  zgldData:[]
              },
              cbr:{
                  record:{
                      value:'',
                      text:'',
                  },
                  cbrData:[]
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
              ygbm:getQueryVariable("ygbm") ? getQueryVariable("ygbm") : "",
              ygxm:decodeURI(getQueryVariable("ygxm")) ? decodeURI(getQueryVariable("ygxm")) :'',
              state:0,
              xh:getQueryVariable("xh") ? getQueryVariable("xh") : "",
              sonplan:getQueryVariable("sonPlan") ? parseInt(getQueryVariable("sonPlan")) : 0,
              ly:getQueryVariable("ly") ? getQueryVariable("ly") : ""
        },
        computed: {
            buttons:function () {
                if(this.state===""){
                    return [{text:'删除', edit: false},{text:'保存', edit: true}];
                }else if (this.state === 0){
                    return [{text:'删除', edit: true},{text:"保存", edit: true}];
                }else {
                    return [{text:'删除', edit: false},{text:"保存", edit: false}];
                }
            }
        },
        methods: {
            eval(e){
                let state = this.state;
                return eval(e)
            },
            show(e){
               let zblx = this.zblx;
               return eval(e)
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
                })
            },
            btnFun(res){
                if(res == '0'){
                    let param = new URLSearchParams();
                    param.append("xh", this.xh);
                    if(this.xh){
                        service.monthPlanDelete(param ,function (data) {
                            console.info(data);
                            //页面跳转列表
                            mui.toast('删除成功',{ duration:3000, type:'div' });
                            service.goBridgeList()
                        });
                    }

                }else if(res == '1'){
                    let data={
                        zblx:this.zblx ? this.zblx : '9',
                        zbms:this.zbms,
                        hlzb:this.zds.filter(val => val.field === 'hlzb')[0].value,//衡量指标*
                        gznr:this.zds.filter(val => val.field === 'gznr')[0].value,
                        yysmb:this.zds.filter(val => val.field === 'yysmb')[0].value,
                        ygznr:this.zds.filter(val => val.field === 'ygznr')[0].value,//月度考核目标*
                        xdfa:this.zds.filter(val => val.field === 'xdfa')[0].value,//行动方案*
                        cbr:this.cbr.record.value,
                        dfld:this.zgld.record.value,
                        kssj:this.kssj.record.value,
                        yjwc:this.jssj.record.value,
                        ygbm:this.ygbm,
                        jyxh:this.xh || '0'
                    };
                    if(data.zblx=='6'){
                        if(!isNotANumber(data.ygznr)){
                            mui.toast('本月月度目标值为数字');
                            return false;
                        }
                        if(data.yysmb!='' || data.yysmb!= null || data.yysmb!='0'){
                            if(data.yysmb < data.ygznr ){
                                mui.toast('本月月度目标值不能小于月预算目标');
                                return false;
                            }
                        }
                    }
                    if(data.zblx =='9'){
                        if(data.hlzb==''||data.hlzb==null){
                            mui.toast('衡量指标不能为空');
                            return false;
                        }
                    }
                    if(data.ygznr==''||data.ygznr==null){
                        mui.toast('本月月度目标值不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(data.xdfa==''|| data.xdfa==null){
                        mui.toast('本月行动方案不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    service.monthPlanSave(data,function (res) {
                        //保存完成跳转list;
                        console.info(res);
                            mui.toast('保存成功',{ duration:3000, type:'div' });
                            service.goBridgeList()
                    });
                }
            },
        },
        created() {
            this.getData();
            //初始化时间
            let now = new Date();
            let year = now.getFullYear() + "";
            let month = (now.getMonth() + 1) + "";
            let begin = year + "-" + Appendzero(month)+ "-" + "01";
            let lastDateOfCurrentMonth = new Date(year,Appendzero(month),0);
            let end = year + "-" + Appendzero(month) + "-" + lastDateOfCurrentMonth.getDate();
            this.kssj.record = {"text":begin,"value":begin};
            this.jssj.record = {"text":end,"value":end};
        },
        mounted(){
            this.$nextTick(function () {
                let self = this;
                service.getRankRelationship(self.ygbm,function (data) {
                    self.$set(self.zgld, "zgldData", data.sjld.map(item=>{return {text: item.ygxm,value: item.ygbm}}));
                    self.$set(self.zgld, "record", data.sjld.filter(sjld => sjld.mr === '1').map(item=>{return{text:item.ygxm,value:item.ygbm}})[0]);
                    let selfyg = {ygxm:self.ygxm,mr:'1',ygbm:self.ygbm};
                    data.zjxs.unshift(selfyg);
                    self.$set(self.cbr, "cbrData", data.zjxs.map(item=>{return {text: item.ygxm,value: item.ygbm}}));
                    if(self.xh=="" || self.sonplan){
                        self.$set(self.cbr,"record",data.zjxs.filter(zjxs => zjxs.mr === '1').map(item=>{return{text:item.ygxm,value:item.ygbm}})[0]);
                    }
                });
                //来自月计划的详情
                if(self.xh && self.ly){
                    //回显月计划的内容
                    service.monthPlanDetailInit( self.xh ,function (acct,perms) {
                       // console.info(acct+','+perms);
                            self.zds = acct.data.list;
                            self.zblx = perms.detial['zblx'];
                            self.zbms = self.zblxRecord.value = perms.detial['zbms'];
                            self.zds.forEach(function (item) {
                                console.info(item);
                                item.value = perms.detial[item.field] ? perms.detial[item.field] : "-";
                            });
                        });
                    self.state = ''|| 0;
                    self.xh = '';
                }else if(self.xh && self.sonplan){
                    service.monthPlanDetailInit( self.xh ,function (acct,perms) {
                        // console.info(acct+','+perms);
                        self.zds = acct.data.list;
                        self.zblx = '7';
                        self.zbms = self.zblxRecord.value = perms.detial['zbms']+'行动方案';
                        self.kssj.record = {"text":perms.detial['kssj'],"value":perms.detial['kssj']};
                        self.jssj.record = {"text":perms.detial['yjwc'],"value":perms.detial['yjwc']};
                    });
                }else if(self.xh){
                    //回显
                    service.monthPlanDetailInit( self.xh ,function (acct,perms) {
                        // console.info(acct+','+perms);
                        self.zds = acct.data.list;
                        self.zblx = perms.detial['zblx'];
                        self.zbms = self.zblxRecord.value = perms.detial['zbms'];
                        self.zds.forEach(function (item) {
                            console.info(item);
                            item.value = perms.detial[item.field] ? perms.detial[item.field] : '-';
                            self.state = parseInt(perms.detial['state']);
                            self.$set(self.cbr,"record", {value:perms.detial["cbr"],text:perms.detial["n_cbr"]})
                        });
                    });
                }else{
                    let self = this;
                    service.monthPlanDetailInit(function (res) {
                         self.zds = res.data.list;
                         if(self.zblx =='9'){
                             self.zbms = self.zblxRecord.value = '其他重点工作',
                             self.state = ""
                         }
                    });
                }
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
function Appendzero(obj){
    if(obj<10) return "0" +""+ obj;
    else return obj;
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