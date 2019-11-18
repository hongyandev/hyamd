require(['vue', 'mui','service','picker','dtpicker'],
    function (Vue, mui, service) {
    new Vue({
        el: '#month_list',
        components: {

        },
        template: `<div class="monthLists">
                        <ul>
                            <li v-for="(item,index) in lists" @click="goDetail(item.xh)" class="mui-content">
                                <div class="mui-row">
                                    <div class="mui-col-sm-8 mui-col-xs-8">
                                        <div class="mui-table-view-cell">
                                            <a class="mui-info">
                                                <p>{{item.hlzb}}</p> 
                                                <div class="mui-sminfo">{{item.xdfa}}</div>  
                                            </a>
                                        </div>
                                    </div>
                                    <div class="mui-col-sm-4 mui-col-xs-4">
                                        <div class="mui-table-view-cell">
                                            <a class="mui-navigate-right">
                                                <p>{{item.n_state}}</p>
                                                <time>{{item.yjwc}}</time>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="mui-bottom-fixed">
                        <div class="mui-input-row" id="month">
                            <label class="mui-label">日期</label>
                            <input type='text' @click="show" :value="month" class="font mui-input mui-col-xs-6" placeholder="请选择" id="datMONTH" value="" readonly="true">
                            <button @click="queryLists" type="button" class="mui-btn mui-sure">确定</button>
                        </div>
                        </div>
                   </div>`,
        data:{
            month:'',
            lists:[],
            ygbm:getQueryVariable("ygbm") ? getQueryVariable("ygbm") : "",
            ygxm:decodeURI(getQueryVariable("ygxm")) ? decodeURI(getQueryVariable("ygxm")) :'',
        },
        computed: {
           realDate:function(){
               return this.month + '-01'
           }
        },
        methods: {
            show:function () {
                let self = this;
                self.dtpicker.show(function(rs){
                    self.month = rs.text;
                })
            },
            initDate: function () {
                mui.init();
                this.dtpicker = new mui.DtPicker({
                    type: "month",
                    beginYear:1950,
                    endYear:2050,
                    value: this.month.value,
                });
                this.dtpicker.setSelectedValue(this.month.value);
            },
            queryLists:function () {
                let self = this;
                let data = {
                    cbr: this.ygbm,
                    xz:'3',
                    kssj:this.realDate
                };
                service.getMonthLists(data,function (res) {
                    //console.info(res)
                    self.lists = res.list
                })
            },
            goDetail:function (xh) {
                location.href='list.html?ygbm='+this.ygbm+'&ygxm='+this.ygxm+'&xh='+xh+'&ly=0';
               /*service.goDetail(xh,function (res) {
                   localStorage.setItem("detail",JSON.stringify(res.detial));
                   location.href='list.html?xh='+xh;
                   console.info(res);
               })*/
            }
        },
        created() {
            function Appendzero(obj){
                if(obj<10) return "0" +""+ obj;
                else return obj;
            };
            //初始化时间
            let now = new Date();
            let year = now.getFullYear() + "";
            let month = (now.getMonth() + 1) + "";
            this.month = year + "-" + Appendzero(month);

        },
        mounted(){
            this.$nextTick(function () {
                this.initDate();
                this.queryLists();
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
