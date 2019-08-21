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
                           <text-area v-for="zd in zds" :zd="zd" :val="zd.value"></text-area>
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


            }
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
                    service.monthPlanDJCancel(function (res) {

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
                service.getDataInit(function (res) {

                })
                // var self = this;
                // var result = {"zgld":"zhbh"};
                // axios.get('../source/temp/zdData.json').then(res => {
                //     self.zgld.zgldData = res.data.conLists;
                //     this.zgld.record = res.data.conLists[0];
                //     if (true){
                //       this.zgld.record = res.data.conLists.filter(z => z.value === result.zgld)[0]
                //     }else{
                //         this.zgld.record = res.data.conLists[0]
                //     }
                // })
            })
        }

    })
})
