define(['vue','picker','dtpicker'], function (Vue) {
    return Vue.extend({
        name: 'dtpicker',
        data: function () {
            return {
                datas:{},
                dtpicker:null
            }
        },
        props:{
            title: String,
            id: String,
            record: {
                type: Object
            }
        },
        template:
            `<div class="mui-content">
                <h5 class="mui-content-padded">{{title}}</h5>
                <div class="mui-border">
                <button :id='id' data-options='{"type":"date"}' class="btn mui-btn mui-btn-block" @click="show">{{record.value}}</button>
                <div class="ui-alert"></div>
                </div>
            </div>`,
        methods:{
            show:function () {
                let self = this;
                self.dtpicker.show(function(rs) {
                    console.info(rs);
                    self.$emit('changeTime', rs.text);
                    /*
                     * rs.value 拼合后的 value
                     * rs.text 拼合后的 text
                     * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                     * rs.m 月，用法同年
                     * rs.d 日，用法同年
                     * rs.h 时，用法同年
                     * rs.i 分（minutes 的第二个字母），用法同年
                     */

                    /* self.picker.dispose();
                     self.picker = null;*/
                });
            },
            init: function () {

                mui.init();
                this.dtpicker = new mui.DtPicker({
                    type: "date",
                    beginYear:1950,
                    endYear:2050,
                    value: this.record.value,
                });
                this.dtpicker.setSelectedValue(this.record.value);
            }
        },
        mounted(){
           // console.log('1111');
            this.init();
        }
    })
})