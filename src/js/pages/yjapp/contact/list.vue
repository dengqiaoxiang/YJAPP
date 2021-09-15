<template>
	<scroller>
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
                @click="selectType">
              <div class="search-text-box">
                  <text class="search-bar-left-text">类型: </text>
                  <text class="search-bar-right-text">{{typeList[typeIndex].strName}}</text>
                  <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png"
                          class="search-bar-left-icon"></image>
              </div>
          </div>

          <div class="search-bar-left"
                @click="selectProgress">
              <div class="search-text-box">
                  <text class="search-bar-left-text">进度: </text>
                  <text class="search-bar-right-text">{{progressList[progressIndex].strName}}</text>
                  <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png"
                          class="search-bar-left-icon"></image>
              </div>
          </div>
      </div>
		</div>
		<scroller :scroll-direction="scrollType"
		          class="table"
		          @touchstart="ontouchstart">
			<div class="table-cell">
				<div class="table-td table-head">
					<text class="table-text">发件人</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">发布时间</text>
				</div>
				<div class="table-td table-head widthCtn">
					<text class="table-text">问题内容</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">类型</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">收件部门</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">处理人</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">处理进度</text>
				</div>
				<div class="table-td table-head widthCtn">
					<text class="table-text">处理结果</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">处理时间</text>
				</div>
			</div>
			<recycle-list ref="list"
			              for="(item, cellIndex) in listData" :key="cellIndex"
			              @loadmore="getData">
				<cell-slot>
					<div class="table-cell"
					     @click="toDetail(item,cellIndex)">
						<div class="table-td">
							<text class="table-text">{{item.Sender}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.SendDateStr}}</text>
						</div>
						<div class="table-td widthCtn">
							<text class="table-text text-ctn">{{item.LiaisonContent}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.SendType}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.DepartName}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.Handler}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.HandlerSchedule}}</text>
						</div>
						<div class="table-td widthCtn">
							<text class="table-text text-ctn">{{item.HandlerResult}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.HandlerDateStr}}</text>
						</div>

					</div>
				</cell-slot>
			</recycle-list>
		</scroller>
		<image src='http://yj.kiy.cn/Content/Images/App/assets/5-121204194026.gif'
		       v-if="showload"
		       style="height:40px;width:300px,align-items:center;background-color:#fff;"
		       resize="contain"
		       quality="original"></image>

		<bmmask class="mask"
		        animation="transition"
		        position="top"
		        :duration="300"
		        ref="bmmask">
			<bmpop class="modal-top">
				<bmcalendar class="calendar"
				            :selectType="type"
				            ref="calendar"
				            @finish="finish"
				            :startDate="startDate"
				            :endDate="endDate"
				            :maximumDate="maximumDate"
				            :minimumDate="minimumDate"></bmcalendar>
			</bmpop>
		</bmmask>

		<wxc-popover ref="wxc-popover"
		             :buttons="btns"
		             :position="popoverPosition"
		             :arrowPosition="popoverArrowPosition"
		             @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>

	</scroller>

</template>

<script>
import { WxcPopover} from "weex-ui";
import searchBar from "../_mods/search-bar";
import datepick from "../_mods/datepick";
import API from "Utils/api";
const picker = weex.requireModule("picker");
var modal = weex.requireModule('modal')

export default {
  components: {
    searchBar,
    WxcPopover,
    datepick
  },
  data() {
    return {
      listData: [],
      param: {
        Page: 0,
        Rows: 15,
        Type: '',
        Progress: ''
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
      //选择类型
      typeIndex: 0,
      typeList: [
          {
              strName: "全部"
          },
          {
              strName: "正常",
              Id: 1
          },
          {
              strName: "紧急",
              Id: 2
          }
      ],
      //选择进度
      progressIndex: 0,
      progressList: [
          {
              strName: "全部"
          },
          {
              strName: "未处理",
              Id: 1
          },
          {
              strName: "已处理",
              Id: 2
          },
          {
              strName: "无法处理",
              Id: 3
          }
      ],
      popoverPosition: { x: 15, y: 100 },
      popoverArrowPosition: { pos: "top", x: 50 }
    };
  },
  eros: {
    beforeBackAppear(params) {//回退信息
      if(params.isRefresh){ //新增
        this.refresh();
      }

    }
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
    this.$navigator.setRightItem({
        text: '新增',
        fontWeight: 'normal'
      }, () => {
        this.$router.open({
        name: 'contactAdd',
        type: "PUSH"
      });
    })
  },
  methods: {
    async getData() {
      var _this = this;
      this.param["Page"]++;
      // 做权限控制
      if (this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {
      } else {
        this.param = Object.assign(this.param, {
          DeliverPhone: this.userInfo.Mobile,
        //   SalesmanId: this.userInfo.adminId
        });
      }
      if (this.param["Page"] === 1) {
        _this.$notice.loading.show("正在加载");
      } else {
        this.showload = true;
      }
      console.log(this.param);
      var RES = await API.KIY_SEARCHCONTACT(this.param);
      var parseRes = JSON.parse(RES);
      
      if (parseRes.Success) {
        if (this.param["Page"] === 1) {
          this.listData = [];
        }
        var DGDATA = parseRes.Data.rows;
        if (DGDATA.length != 0) {
          this.listData = DGDATA;
        } else {
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
          text: par.params.title, // 展示的文字 (和图片 二选一)
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
        page_size: 15
      };
      this.searchId = item;
      this.getData();
    },
    changeProper(item) {},

    //选择类型
    selectType() {
        var items = [];
        if (items.length === 0) {
            this.typeList.map(item => {
                items.push(item.strName);
            });
        }
        picker.pick(
            {
                index: this.typeIndex,
                items
            },
            event => {
                if (event.result === "success") {
                    this.typeIndex = event.data;
                    //选择类型
                    if(event.data !== 0){
                      let type = this.typeList[event.data].strName;
                      this.param.Type = type;
                    }else{
                      this.param.Type = '';
                    }
                    this.refresh();
                }
            }
        );
    },
    //选择处理进度
    selectProgress() {
        var items = [];
        if (items.length === 0) {
            this.progressList.map(item => {
                items.push(item.strName);
            });
        }

        picker.pick(
            {
                index: this.progressIndex,
                items
            },
            event => {
                if (event.result === "success") {
                    this.progressIndex = event.data;
                    //选择进度
                    if(event.data !== 0){
                      let progress =  this.progressList[event.data].strName
                      this.param.Progress = progress;
                    }else{
                      this.param.Progress = '';
                    }
                    this.refresh();
                }
                
        }
        );
    },
    async toDetail(item,idx) {
      let Item = Object.assign(item,{idx: idx});
      this.$router.open({
        name: "contactDetail",
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
<style lang="sass" src='./list.scss'></style>

