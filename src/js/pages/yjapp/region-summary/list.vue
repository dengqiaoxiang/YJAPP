<template>
    <div class="page">
        <div class="search-bar">
            <datepick ref="datePick"
                      :beginDate="param['@StartDate']"
                      :endDate="param['@EndDate']"
                      init
                      @selectTime="selectTime"
                      @startDateFinish="startDateFinish"
                      @endDateFinish="endDateFinish"></datepick>
            <div class="search-bar-top">
                <div class="search-bar-left"
                     @click="selectProvince">
                    <div class="search-text-box">
                        <text class="search-bar-left-text">省份: </text>
                        <text class="search-bar-right-text">{{selectProvinceData.name}}</text>
                        <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
                    </div>
                </div>
                <div class="search-bar-left"
                     @click="selectCity">
                    <div class="search-text-box">
                        <text class="search-bar-left-text">城市: </text>
                        <text class="search-bar-right-text">{{selectCityData.name}}</text>
                        <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png"
                               class="search-bar-left-icon"></image>
                    </div>
                </div>
            </div>
            <div class="search-bar-top">
                <div class="search-bar-left"
                     @click="selectProduct">
                    <div class="search-text-box">
                        <text class="search-bar-left-text">品类: </text>
                        <text class="search-bar-right-text">{{selectProductData.Text}}</text>
                        <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png"
                               class="search-bar-left-icon"></image>
                    </div>
                </div>
            </div>
        </div>
        <scroller scroll-direction="horizontal"
                  class="table">
            <div class="table-cell">
                <div class="table-td table-head"><text class="table-text">区域</text></div>
                <div class="table-td table-head"><text class="table-text">会员数</text></div>
                <div class="table-td table-head"><text class="table-text">交易量</text></div>
                <div class="table-td table-head"><text class="table-text">商品额</text></div>
                <div class="table-td table-head"><text class="table-text">商品总价</text></div>
                <div class="table-td table-head"><text class="table-text">运费</text></div>
                <div class="table-td table-head"><text class="table-text">成本额</text></div>
                <div class="table-td table-head"><text class="table-text">毛利额</text></div>
            </div>
             <div class="table-cell table-sum" v-if="listData.length">
                <div class="table-td table-top"><text class="table-text">汇总:</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.CountUserSum}}</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.CountSum}}</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.TotalSum}}</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.Sum}}</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.FreightTotal}}</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.CostSum}}</text></div>
                <div class="table-td table-top"><text class="table-text">{{SumData.ProfitSum}}</text></div> 
            </div>
            <!-- @loadmore="getData" -->
            <list class="bui-list"
                  ref="list"
                  :show-scrollbar="true"
                  :showRefresh="true"
                  @refresh="onrefresh"
                  loadmoreoffset="2">
                <cell class="table-cell"
                      v-for="(item , key) in listData"
                      @click="toDetail(item)"
                      :key="key">
                    <div class="table-td"><text class="table-text">{{item.AddressStr}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.CountUser}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.Count}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.BusinessMoney}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.ProductTotal}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.FreightSum}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.CostPriceSum}}</text></div>
                    <div class="table-td"><text class="table-text">{{item.ProfitPriceSum}}</text></div>
                </cell>
            </list>

        </scroller>
        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
    </div>

</template>
<script>
import { WxcPopover } from "weex-ui";
import datepick from "../_mods/datepick";
import API from "Utils/api";
const picker = weex.requireModule("picker");
const bmAxios = weex.requireModule('bmAxios')
export default {
    components: {
        datepick,
        WxcPopover
    },
    data() {
        return {
            listData: [],
            SumData: {},
            param: {
                "Qid": '',
                "Pro": '',
                "City": '',
            },
            regionList: [],
            selectProvinceData: {
                name: "全部"
            },
            selectCityData: {
                name: "全部"
            },
            selectProductData: {
                Text: "全部"
            },
            provinceList: [],
            cityList: [],
            productsList: [],
            provinceIdx: -1,
            cityIdx: -1,
            index: -1,
            showload: false,
            popoverPosition: { x: 15, y: 100 },
            popoverArrowPosition: { pos: "top", x: 50 }
        };
    },
    computed: {
        userInfo() {
            var userInfo = API.get_userInfo(this);
            return userInfo;
        }
    },
    created() {
        this.$router.getParams().then(resData => {
            this.init(resData);
        });
    },
    mounted() {
        var _this = this;
        let syncRegion = this.$storage.getSync('regionList')
        syncRegion ? this.provinceList = syncRegion : this.getRegionList(0);
        this.$event.on("paySuccess", params => {
            _this.selectAllStatu = false;
            _this.getData();
        });
    },
    methods: {
        // 获得对应级别的地市信息
        async getRegionList (regionId) {
            var that = this;
            //const res = await API.YJ_GetRegion({id: regionId});
            this.$notice.loading.show("正在加载");
            bmAxios.fetch({
                url: 'https://www.kiy.cn/common/RegionAPI/GetRegion?id='+regionId,
                method: 'GET'
            }, (resData) => {
                if(resData.status == 200){
                    if(regionId == 0){
                        that.provinceList = resData.data;
                        that.$storage.setSync('regionList', resData.data)
                    }
                    else that.cityList = resData.data;
                    this.$notice.loading.hide();
                }
            })
           
        },

        async getData() {
            const _this = this;
            let param = {};
           
            this.$notice.loading.show("正在加载");
            param = Object.assign(this.param, param);

            if (this.userInfo.RoleId == 1 || this.userInfo.RoleId == 4) {

            } else {
                if(this.userInfo.RoleId == 8 || this.userInfo.RoleId == 13) {
                    param = Object.assign(param, {
                        SalesmanId: this.userInfo.adminId
                    });
                }else {
                    param = Object.assign(param, {
                        IdManager: this.userInfo.adminId
                    });
                }
            }
            var RES = await API.YJ_RegionSummaryList(param);
            this.$notice.loading.hide();
            if(RES.Success){
                var DGDATA = RES.Data;
                if (DGDATA.length != 0) {
                    this.listData = DGDATA;
                    this.SumData = RES.SumData;
                } else {
                    this.listData = [];
                    this.SumData = {}
                    this.$notice.toast({
                        message: "暂无数据"
                    });
                }
            }else{
                this.$notice.toast({
                    message: ''+RES.Message+''
                });
            }
                
        },
        init(param) {
            this.$navigator.setCenterItem(
                {
                    text: param.params.title, // 展示的文字 (和图片 二选一)
                    textColor: "", // 文字颜色 (默认为白色)
                    fontSize: "32", // 字号（默认32px）
                    fontWeight: "normal", // 是否加粗（默认不加粗）
                    image: "" // 展示的图片url (和文字 二选一，文字优先级更高)
                },
                () => {
                    // 点击回调
                }
            );
            // 获取月头
            const dateFormate = {
                startDate: API.get_date("beginMonth").split(" ")[0],
                endDate: API.get_date("today")
            };
            this.$refs["datePick"].searchDate["@beginDate"] =
                dateFormate.startDate;
            this.$refs["datePick"].searchDate["@endDate"] = dateFormate.endDate;
            this.param = Object.assign(this.param, {
                startDate: dateFormate.startDate,
                endDate: dateFormate.endDate
            });
            this.param = Object.assign(this.param, param.type);
            this.getProductsType();
            this.getData();
        },
        startDateFinish(startDate) {
            this.param["startDate"] = startDate;
            if (this.param["startDate"] == undefined) {
                this.param["startDate"] = startDate;
            }
            this.getData();
        },
        endDateFinish(endDate) {
            this.param["endDate"] = endDate;
            if (this.param["endDate"] == undefined) {
                this.param["endDate"] = endDate;
            }
            this.getData();
        },
        selectProvince(){
            var items = [];
            if (items.length === 0) {
                this.provinceList.map(item => {
                    items.push(item.name);
                });
            }
            picker.pick(
                {
                    index: this.provinceIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.selectProvinceData = this.provinceList[event.data];
                        this.provinceIdx = event.data;
                        this.param.Pro = this.provinceList[event.data].name;
                        this.param.City = '';
                        this.selectCityData.name = '全部';
                        this.getRegionList(this.provinceList[event.data].id)
                        this.getData();
                    }
                }
            );
        },
        selectCity(){
           if(this.selectProvinceData.name == '全部'){
               this.$notice.toast({message: '请先选择省份'})
               return;
           }
            var items = [];
            if (items.length === 0) {
                // items.push("全部")
                this.cityList.map(item => {
                    items.push(item.name);
                });
            }
            picker.pick(
                {
                    index: this.cityIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.selectCityData = this.cityList[event.data];
                        this.cityIdx = event.data;
                        this.param.City = this.cityList[event.data].name;
                        this.getData();
                    }
                }
            );
        },
        selectProduct() {
            var items = [];
            if (items.length === 0) {
                // items.push("全部")
                this.productsList.map(item => {
                    items.push(item.Text);
                });
            }
            picker.pick(
                {
                    index: this.index,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.selectProductData = this.productsList[event.data];
                        this.param.Qid = this.productsList[event.data].Value;
                        this.index = event.data;
                        this.getData();
                    }
                }
            );
        },
        async getProductsType() {
            const RES = await API.YJ_GetQItemList({});
            if (RES.Success) {
                this.productsList = RES.Data;
            } else {
                this.$notice.toast({
                    message: "获取产品信息失败"
                });
            }
        },
        toDetail(item) {
            let Router = "regionSummaryDetail";
            let Item = item;
            this.$router.open({
                name: Router,
                type: "PUSH",
                params: Item
            });
        }
    }
};
</script>

<style scoped>
.page {
    height: auto;
}
.scroller {
    height: auto;
}
.search-bar {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #dddddd;
}
.mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-top {
    align-items: flex-start;
}

.calendar {
    height: 800px;
    background-color: #ffffff;
    select-color: #1da1f2;
}

.search-date {
    flex-direction: row;
    justify-content: center;
    height: 100px;
    background-color: rgba(31, 181, 252, 0.4);
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #eee;
}
.search-date-text {
    text-align: center;
    width: 375px;
    height: 100px;
    line-height: 100px;
    color: #000;
}
.search-batch {
    width: 750px;
    height: 100px;
    justify-content: center;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #eee;
}
.search-batch-btn {
    width: 400px;
    height: 80px;
    line-height: 80px;
    color: #fff;
    border-radius: 12px;
    text-align: center;
    background-color: #1da1f2;
}
.bottom-box {
    position: relative;
    width: 750px;
    height: 100px;
}
.pay-content {
    margin-left: 84px;
    margin-top: 312px;
    width: 580px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
}
.pay-title {
    height: 105px;
    justify-content: center;
    padding-left: 48px;
    border-bottom-width: 1px;
    border-bottom-style: dotted;
    border-bottom-color: #cccccc;
}
.pay-group {
    flex-direction: row;
    padding-top: 52px;
    justify-content: center;
}
.pay-type {
    width: 215px;
    height: 66px;
}
.example {
    position: absolute;
    right: 0px;
    top: 20px;
    flex-direction: row;
    justify-content: flex-start;
}
.label {
    font-size: 20px;
    line-height: 60px;
    width: 350px;
    color: #666;
    text-align: right;
    margin-right: 20px;
}
.info {
    font-size: 30px;
    line-height: 60px;
    color: #bbb;
    margin-left: 10px;
}
.table {
    width: 1600px;
    min-height: 750px;
}
.table-cell {
    position: relative;
    width: 1600px;
    flex-direction: row;
}
.table-td {
    display: block;
    float: left;
    width: 200px;
    height: 86px;
    line-height: 86px;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-color: #2096f2;
    border-style: solid;
    background-color: #fff;
}
.table-text {
    font-size: 32px;
}
.table-top{
    background-color: yellow;
}

.table-head {
    height: 75px;
    background-color: #e9eaec;
}
.width-200px {
    width: 200px;
}
.width-100px {
    width: 100px;
}
.loading {
    width: 750;
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
}
.indicator-text {
    color: #888888;
    font-size: 42px;
    text-align: center;
}
.indicator {
    margin-top: 16px;
    height: 40px;
    width: 40px;
    color: blue;
}
.select {
    border-width: 1px;
    border-style: solid;
    border-color: rgb(25, 190, 107);
    border-radius: 4px;
    padding: 5px;
    color: rgb(25, 190, 107);
}
.select-two {
    border-color: rgb(237, 63, 20);
    color: rgb(237, 63, 20);
}
.select-three {
    border-color: blue;
    color: blue;
}
.search-bar-top {
    display: flex;
    height: 100px;
    flex-direction: row;
    background-color: #fff;
}
.search-bar-left {
    width: 375px;
    height: 84px;
    /* padding-top: 35px; */
    background-color: #fff;
    align-content: center;
    justify-content: center;
    flex-direction: row;
    color: #666666;
}
.search-text-box {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 375px;
    height: 100px;
    line-height: 100px;
    /* color: #000; */
}
.search-bar-right-text {
    width: 250px;
    height: 50px;
    padding-left: 20px;
    line-height: 50px;
    background-color: #f2f2f2;
    color: #7c7c7c;
    lines: 1;
    text-overflow: hidden;
    font-size: 28px;
}
.search-bar-left-text {
    color: #282828;
    font-size: 28px;
}
.search-bar-left-icon {
    margin-top: 5px;
    margin-left: 5px;
    width: 20px;
    height: 20px;
}
</style>
