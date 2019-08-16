require(['vue', 'components/textArea', 'components/picker', 'service'],
    function (Vue, textArea, picker, service) {
    new Vue({
        el: '#message_list',
        components: {
            'text-area':textArea,
            'picker-input':picker
        },
        template: `<div>
                      <text-area v-for="zd in zds" :zd="zd" :val="zd.value"></text-area>
                      <div class="mui-content">
                          <h5 class="mui-content-padded">主办人</h5>
                          <div class="mui-border">
                             <button class="mui-btn mui-btn-block" type='button'></button>
                          </div>
                      </div>
                      
                      <picker-input ref="zgld" id="showUserPicker" title="直管领导" @comclick="zgldGetData" :record="zgld.record" :dataResouce="zgld.zgldData"></picker-input>
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
                    self.zds = res.data.list;
                    self.zgld.zgldData = res.data.conLists;
                    self.zgld.record = res.data.conLists[0];
                })
            },

        },
        created() {
            this.getData();
        },
        mounted(){
            this.$nextTick(function () {
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
