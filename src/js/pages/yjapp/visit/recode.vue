<template>
	<scroller>
    <datepick ref="datePick"
                :beginDate="param['@StartDate']"
                :endDate="param['@EndDate']"
                init
                @selectTime="selectTime"
			          @startDateFinish="startDateFinish"
			          @endDateFinish="endDateFinish"></datepick>
		<scroller :scroll-direction="scrollType"
		          class="table"
		          @touchstart="ontouchstart">
			<div class="table-cell">
				<div class="table-td table-head widthDate">
					<text class="table-text">业务员id</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">名称</text>
				</div>
				<div class="table-td table-head bigWidth">
					<text class="table-text">业务项目</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">拜访会员号</text>
				</div>
        <div class="table-td table-head widthDate">
					<text class="table-text">联系人</text>
				</div>
        <div class="table-td table-head bigWidth">
					<text class="table-text">公司名称</text>
				</div>
        <div class="table-td table-head">
					<text class="table-text">电话</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">拜访时间</text>
				</div>
        <div class="table-td table-head widthDate">
					<text class="table-text">状态</text>
				</div>
        <div class="table-td table-head widthDate">
					<text class="table-text">审核人</text>
				</div>
        <div class="table-td table-head widthDate">
					<text class="table-text">审核时间</text>
				</div>
			</div>
			<recycle-list ref="list"
			              for="(item, cellIndex) in listData"
			              @loadmore="getData">
				<cell-slot>
					<div class="table-cell">
						<div class="table-td widthDate">
							<text class="table-text">{{item.adminId}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.Visitor}}</text>
						</div>
						<div class="table-td bigWidth">
							<text class="table-text">{{item.VisitItem}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.Userid}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.Nick}}</text>
						</div>
            <div class="table-td bigWidth">
							<text class="table-text">{{item.Company}}</text>
						</div>
            <div class="table-td">
							<text class="table-text">{{item.CellPhone}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.CreateDate}}</text>
						</div>
            <div class="table-td widthDate">
							<text class="table-text">{{item.Status}}</text>
						</div>
            <div class="table-td widthDate">
							<text class="table-text">{{item.ApproverName}}</text>
						</div>
            <div class="table-td widthDate">
							<text class="table-text">{{item.ApproveDate}}</text>
						</div>
					</div>
				</cell-slot>
			</recycle-list>
		</scroller>
	</scroller>

</template>

<script>
import datepick from "../_mods/datepick";
import { WxcPopover } from "weex-ui";
import API from "Utils/api";
export default {
  data() {
    return {
      listData: [],
      param: {
        Page: 0,
        Rows: 15
      },
      searchValue: "",
      type: "range",
      minimumDate: "",
      maximumDate: "",
      startDate: "",
      endDate: "",
      showload: false,
      payGroup: [],
      scrollType: "horizontal",
      searchType: "订单号",
      btns: [
        {
          text: "订单号",
          key: "订单号"
        },
        {
          text: "会员号",
          key: "会员号"
        }
      ],
      userInfo: {},
      popoverPosition: { x: 15, y: 100 },
      popoverArrowPosition: { pos: "top", x: 50 }
    };
  },
  components: {datepick},
  created() {
    this.$router.getParams().then(resData => {
      this.init(resData);
    });
  },
  mounted(){
    this.userInfo = API.get_userInfo(this);
  },
  methods: {
    async getData() {
      var _this = this;
      this.param["Page"]++;
      if (this.searchType == this.btns[0].key && this.searchValue != "") {
        this.param = Object.assign(this.param, { orderId: this.searchValue });
      }
      if (this.searchType == this.btns[1].key && this.searchValue != "") {
        this.param = Object.assign(this.param, { userId: this.searchValue });
      }
      if (this.param["Page"] === 1) {
        _this.$notice.loading.show("正在加载");
      } else {
        this.showload = true;
      }
      var stringRes = await API.YJ_GETVISITLIST(this.param);
      var RES = JSON.parse(stringRes);
      if (RES.Success) {
        _this.$notice.loading.hide();
        if (this.param["Page"] === 1) {
          this.listData = [];
        }
        var RESDATA = RES.Data;
        var DGDATA = RESDATA.rows;
        if (DGDATA.length != 0) {
          DGDATA.map(item => {
            item.adminId = this.userInfo.adminId;
            this.listData.push(item)
          })
        }else{
          this.$notice.toast({
            message: "已经到底部"
          });
        }
        if (this.param["Page"] === 1) {
          _this.$notice.loading.hide();
        } else {
          this.showload = false;
        }
      }
      // this.$refs["list"].refreshEnd()
    },
    init(param) {
      var par = param;
      this.$navigator.setCenterItem(
        {
          text: '拜访记录', // 展示的文字 (和图片 二选一)
          textColor: "", // 文字颜色 (默认为白色)
          fontSize: "32", // 字号（默认32px）
          fontWeight: "normal" // 是否加粗（默认不加粗）
        },
        () => {
          this.refresh();
        }
      );
      // 获取月头
      const dateFormate = {
          startDate: API.get_date("beginMonth").split(" ")[0],
          endDate: API.get_date("today")
      };
      this.$refs["datePick"].searchDate["@beginDate"] = dateFormate.startDate;
      this.$refs["datePick"].searchDate["@endDate"] = dateFormate.endDate;
       //日期
      this.param.StartDate =  dateFormate.startDate;
      this.param.EndDate =  dateFormate.endDate;
      this.param = Object.assign(this.param, param.type);
      this.getData();
    },
    typeChange(value) {
      this.$refs["wxc-popover"].wxcPopoverShow();
    },
    searchClick(value) {
      this.param["Page"] = 0;
      this.getData();
      this.$tools.resignKeyboard().then(
        resData => {
          // 收起成功的回调
        },
        error => {}
      );
    },
    scanClick(val) {
      this.searchValue = val;
      this.refresh();
    },
    refresh() {
      this.param["Page"] = 0;
      this.getData();
    },
    finish(params) {
      this.$notice.toast({
        message:
          "开始时间：" + params.startDate + "\r\n结束时间：" + params.endDate
      });
      this.searchType = {
        "@startDate": params.startDate,
        "@endDate": params.endDate
      };
      this.$refs["bmmask"].hide();
    },
    startDateFinish(startDate) {
      this.param["StartDate"] = startDate;
      if (this.param["EndDate"] == undefined) {
        this.param["EndDate"] = startDate;
      }
      this.refresh();
    },
    endDateFinish(endDate) {
      this.param["EndDate"] = endDate;
      if (this.param["StartDate"] == undefined) {
        this.param["StartDate"] = endDate;
      }
      this.refresh();
    },
    inputChange(val) {
      this.searchValue = val;
    },
    changeType(item) {
      this.param = {
        Page: 0,
        Rows: 15
      };
      this.searchId = item;
      this.getData();
    },
    changeProper(item) {},
    async toDetail(item) {
      // const RES = await API.YJ_GetOrder({'@cytId' : item.Id})
      // var wuliuItem = JSON.parse(RES.DATA)
      let Router = "order-detail";
      let Item = item;
      // if(wuliuItem.length != 0) {
      // 	Router = 'logistical-detail'
      // 	Item = wuliuItem[0]
      // }
      this.$router.open({
        name: Router,
        type: "PUSH",
        params: Item
      });
    },
    popoverButtonClicked(obj) {
      this.searchType = obj.key;
    }
  }
};
</script>

<style scoped>
.blue-color {
  color: #2096f2;
}

.title {
  color: #666666;
}

.text-color {
  color: #333333;
}

.num-color {
  color: #deae07;
}

.gray-color {
  color: #666666;
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
.list {
  width: 750px;
  /* padding-left: 28px; */
  background-color: #f3f6f7;
}

.user-box {
  margin-top: 8px;
  flex-direction: row;
}
.blue-bg {
  background-color: #9fd4fd;
  padding: 8px;
  border-radius: 4px;
}
.shuliang {
  position: absolute;
  flex-direction: column;
  align-items: center;
  top: 45px;
  right: 32px;
  height: 88px;
}
.other {
  position: absolute;
  top: 20px;
  right: 0px;
  font-size: 25px;
  color: #666666;
}

.col {
  flex-direction: row;
  height: 40px;
  /* padding-left: 23px; */
}
.col-icon {
  width: 106px;
  height: 15px;
  margin-top: 7px;
  margin-right: 15px;
}
.address {
  width: 500px;
  text-overflow: ellipsis;
}
.text {
  font-size: 25px;
}
.map {
  background-color: #42b983;
}
.enter-btn {
  width: 144px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: #2096f2;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
}
.loading {
  display: block;
  align-items: center;
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

.table {
  width: 2160px;
  min-height: 750px;
}
.table-cell {
  position: relative;
  flex-direction: row;
}
.table-td {
  display: block;
  float: left;
  width: 220px;
  height: 100px;
  line-height: 100px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #2096f2;
  border-style: solid;
  background-color: #fff;
}
.bigWidth{width: 300px;}
.table-text {
  font-size: 26px;
}
.table-head {
  background-color: #e9eaec;
  height: 75px;
  line-height: 75px;
}
.width270 {
  width: 270px;
}
.widthDate {
  width: 160px;
}
</style>
