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
                          <text-area v-for="zd in zds" :isReadOnly="true" :zd="zd" :val="zd.value" :key="zd.filed"></text-area>
                          <picker-input id="showCbrPicker" title="主办人" @comclick="zgldGetData" :record="cbr.record" :dataResouce="cbr.cbrData"></picker-input>
                          <picker-input id="showUserPicker" :isHidden="true" title="直管领导" @comclick="zgldGetData" :record="zgld.record" :dataResouce="zgld.zgldData"></picker-input>
                          <dtpicker id="stardate" title="预计开始时间" @changeTime="kssjVal"  :record="kssj.record"></dtpicker>  
                          <dtpicker id="enddate"  title="预计结束时间" @changeTime="jssjVal"  :record="jssj.record"></dtpicker>  
                      </div>
                      <nav-bar :btnName="buttons" @btnclick="btnFun"></nav-bar>
                   </div>`,
        data:{
              zblx:'9',
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
              state:"",
              xh:getQueryVariable("xh") ? getQueryVariable("xh") : "",
              ly:getQueryVariable("ly") ? getQueryVariable("ly") : ""
        },
        computed: {
            buttons:function () {
                if(this.state==""){
                    return [{text:'删除', edit: false},{text:'保存', edit: true}];
                }else if (this.state=="0"){
                    return [{text:'删除', edit: true},{text:"保存", edit: true}];
                }else {
                    return [{text:'删除', edit: false},{text:"保存", edit: false}];
                }
            }
        },
        methods: {
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
                    console.info(this.xh);
                    console.info(this.btnData.btnname[0]);
                    let params = {
                        xh:this.xh
                    };
                    if(this.xh){
                        service.monthPlanDelete(params ,function (data) {
                            console.info(data);
                            //页面跳转列表
                            if(data.code=='200'){
                                mui.toast('删除成功',{ duration:3000, type:'div' });
                                service.goBridgeList()
                            }
                        });
                    }

                }else if(res == '1'){
                    let data={
                        zblx:this.zblx ? this.zblx : '9',
                        hlzb:this.zds.filter(val => val.field === 'hlzb')[0].value,
                        gznr:this.zds.filter(val => val.field === 'gznr')[0].value,
                        lastwcqk:this.zds.filter(val => val.field === 'lastwcqk')[0].value,
                        lastpy:this.zds.filter(val => val.field === 'lastpy')[0].value,
                        lastjjfa:this.zds.filter(val => val.field === 'lastjjfa')[0].value,
                        yysmb:this.zds.filter(val => val.field === 'yysmb')[0].value,
                        ygznr:this.zds.filter(val => val.field === 'ygznr')[0].value,
                        xdfa:this.zds.filter(val => val.field === 'xdfa')[0].value,
                        cbr:this.cbr.record.value,
                        dfld:this.zgld.record.value,
                        kssj:this.kssj.record.value,
                        yjwc:this.jssj.record.value,
                        ygbm:this.ygbm

                    };
                    /*this.zds.forEach(function (item) {
                        if(item.value==''||item.value == null){
                            mui.toast('请输入'+item.title);
                            return false;
                        }
                    });*/
                    console.info(data.zblx);
                    if(data.zblx=='6'&& !isNotANumber(data.ygznr)){
                        mui.toast('本月月度目标值为数字');
                        return false;
                    }
                    if(data.hlzb==''||data.hlzb==null){
                        mui.toast('衡量指标不能为空');
                        return false;
                    }
                    if(data.zblx!='9'){
                        if(data.gznr==''|| data.gznr==null){
                            mui.toast('年度目标值不能为空',{ duration:3000, type:'div' });
                            return false;
                        }
                    }
                    /*if(data.lastwcqk==''|| data.lastwcqk==null){
                        mui.toast('上月完成情况不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(data.lastpy==''|| data.lastpy==null){
                        mui.toast('差异分析不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(data.lastjjfa==''|| data.lastjjfa==null){
                        mui.toast('解决方案不能为空',{ duration:3000, type:'div' });
                        return false;
                    }*/
                    if(data.yysmb==''||data.yysmb==null){
                        mui.toast('月预算目标不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(data.ygznr==''||data.ygznr==null){
                        mui.toast('本月月度目标值不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(data.xdfa==''|| data.xdfa==null){
                        mui.toast('本月行动方案不能为空',{ duration:3000, type:'div' });
                        return false;
                    }
                    if(!isNotANumber(data.yysmb)){
                        mui.toast('月预算目标请输入数字',{ duration:3000, type:'div' });
                        return false;
                    }
                    service.monthPlanSave(data,function (res) {
                        //保存完成跳转list;
                        console.info(res);
                        if(data.code=='200'){
                            mui.toast('保存成功',{ duration:3000, type:'div' });
                            service.goBridgeList()
                        }
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
                    self.$set(self.cbr,"record",data.zjxs.filter(zjxs => zjxs.mr === '1').map(item=>{return{text:item.ygxm,value:item.ygbm}})[0]);
                });
                //来自月计划的详情
                if(this.xh && this.ly){
                    //回显月计划的内容
                    service.monthPlanDetailInit( this.xh ,function (acct,perms) {
                       // console.info(acct+','+perms);
                            self.zds = acct.data.list;
                            self.zblx = perms.detial['zblx'];
                            self.zds.forEach(function (item) {
                                console.info(item);
                                item.value = perms.detial[item.field];
                            });
                            $("textarea").removeAttr('readonly');
                            $("#n_zblx").attr("readonly",'readonly');
                        });
                    self.state = '';
                    self.xh = '';
                }else if(this.xh){
                    //回显
                    service.monthPlanDetailInit( this.xh ,function (acct,perms) {
                        // console.info(acct+','+perms);
                        self.zds = acct.data.list;
                        self.zblx = perms.detial['zblx'];
                        self.zds.forEach(function (item) {
                            console.info(item);
                            item.value = perms.detial[item.field];
                        });
                    });
                }else{
                    let self = this;
                    service.monthPlanDetailInit(function (res) {
                        self.zds = res.data.list;
                        if(self.zblx ='9'){
                            console.info(self.zds);
                            self.zds.filter(val => val.field === 'n_zblx')[0].value='其他重点工作';
                            $("textarea").removeAttr('readonly');
                            $("#n_zblx").attr("readonly",'readonly');
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