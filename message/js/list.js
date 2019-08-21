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
                          <dtpicker  id="enddate" title="预计结束时间" @changeTime="jssjVal"  :record="jssj.record"></dtpicker>  
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
                      btnname:['删除','提交'],
                },
              params:{}
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
                })
            },
            btnFun(res){
                if(res == '0'){
                    service.monthPlanDelete(function (res) {

                    });
                }else if(res == '1'){
                    var data={
                        zblx:'1',
                        hlzb:'',
                        gznr:'',
                        lastwcqk:'',
                        lastpy:'',
                        lastjjfa:'',
                        yysmb:'',
                        ygznr:'',
                        xdfa:'',
                        cbr:'',
                        dfld:'',
                        kssj:'',
                        yjwc:''
                    };
                    service.monthPlanSave( params,function (res) {
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
            })
        }

    })
})
