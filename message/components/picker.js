define(['vue','picker','poppicker'], function (Vue) {
    return Vue.extend({
        name: 'picker',
        data: function () {
            return {
                datas:{}
            }
        },
        props:{
            title: String,
            id: String,
            record: {
                type: Object
            },
            callBack: {
                type: Function
            },
            dataResouce:Array
        },
        template:
            `<div class="mui-content">
                <h5 class="mui-content-padded">{{title}}</h5>
                <div class="mui-border">
                <button :id="id" class="mui-btn mui-btn-block" type='button' :val="record.value" @click="show">{{record.text}}</button>
                    <div class="ui-alert"></div>
                </div>

            </div>`,
        methods:{
            show:function () {
                let self = this;
                //self.datapick.setData(this.dataResouce);
                    self.datapick.show(function (items) {
                        self.$emit('comclick', items);
                        //返回 false 可以阻止选择框的关闭
                        //return false;
                    });
            },
            init: function () {
                let self = this;
                mui.init();
                mui.ready(function () {
                    var dataPicker = new mui.PopPicker();
                    dataPicker.setData(this.dataResouce);
                    self.datapick = dataPicker;
                });
            }
        },
        mounted(){
            console.log('1111');
            this.init();
        },
        watch:{
            dataResouce:{
                handler(){
                    this.datapick.setData(this.dataResouce);
                }
            },
            immediate: true
        }
    })
})