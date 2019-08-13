require([
    'vue',
    'axios',
    'mui',
    'picker',
    'poppicker',
    'components/textArea',
    'components/picker'
], function (Vue, axios, mui, pick, PopPicker,textArea,picker) {
    new Vue({
        el: '#message_list',
        components: {
            'text-area':textArea,
            'picker':picker
        },
        template: `<div>
                      <text-area v-for="zd in zds" :zd="zd" :key="zd.field"></text-area>
                      <picker id="showUserPicker" title="直管领导" @click="getZgld()" :record="zgld"></picker>
                   </div>`,
        data() {
            return{
                zds:[],
                selData:[],
                zgld:{value:'',text:''}
            }
        },
        methods: {
            getData() {
                var self = this;
                return axios.get('../source/temp/zdData.json').then(res => {
                    self.zds = res.data.list;
                })
            },
            getZgld() {
                var self = this;
                (function ($,doc) {
                    $.init();
                    $.ready(function () {
                        var userPicker = new $.PopPicker();
                        userPicker.setData([{
                            value: 'ywj',
                            text: '董事长 叶文洁'
                        }, {
                            value: 'aaa',
                            text: '总经理 艾AA'
                        }, {
                            value: 'lj',
                            text: '罗辑'
                        }, {
                            value: 'ymt',
                            text: '云天明'
                        }, {
                            value: 'shq',
                            text: '史强'
                        }, {
                            value: 'zhbh',
                            text: '章北海'
                        }, {
                            value: 'zhy',
                            text: '庄颜'
                        }, {
                            value: 'gyf',
                            text: '关一帆'
                        }, {
                            value: 'zhz',
                            text: '智子'
                        }, {
                            value: 'gezh',
                            text: '歌者'
                        }]);
                        var showUserPickerButton = doc.getElementById('showUserPicker');
                        //var userResult = doc.getElementById('userResult');
                        showUserPickerButton.addEventListener('tap', function (event) {
                            userPicker.show(function (items) {
                                //userResult.innerText = JSON.stringify(items[0]);
                                self.zgld = items[0];
                                //返回 false 可以阻止选择框的关闭
                                //return false;
                            });
                        }, false);
                    });
                })(mui,document);
            }
        },
        created() {
            this.getData();
        },
        mounted(){
            /*this.getZgld();*/
            this.$nextTick(function () {
                this.getZgld();
            })
        }

    })
})
