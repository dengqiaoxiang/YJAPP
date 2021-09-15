<template>
	<div>
    <div class="search-bar-left">
        <div class="search-text-box" >
            <text class="search-bar-left-text">手机号: </text>
            <input class="search-bar-right-text" v-model="param.phone" @return="searchBtn" type="tel" return-key-type="search"  placeholder="输入手机号查询">
            <wxc-button text="搜索" size="small" @wxcButtonClicked="searchBtn"></wxc-button>
        </div>
    </div>
		<scroller :scroll-direction="scrollType"
		          class="table"
		          @touchstart="ontouchstart">
      
			<div class="table-cell">
        <div class="table-td table-head">
					<text class="table-text">会员号</text>
				</div>
        <div class="table-td table-head width220">
					<text class="table-text">会员名</text>
				</div>
				<div class="table-td table-head width270">
					<text class="table-text">公司名称</text>
				</div>
				<div class="table-td table-head width220">
					<text class="table-text">手机</text>
				</div>
				<div class="table-td table-head width220">
					<text class="table-text">QQ</text>
				</div>
				<div class="table-td table-head width220">
					<text class="table-text">创建时间</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">审核状态</text>
				</div>
			</div>
			<recycle-list ref="list"
			              for="(item, cellIndex) in listData" :key="cellIndex"
			              @loadmore="getData">
				<cell-slot>
					<div class="table-cell"
					     @click="toDetail(item,cellIndex)">
						<div class="table-td">
							<text class="table-text">{{item.Id}}</text>
						</div>
            <div class="table-td width220">
							<text class="table-text">{{item.UserName}}</text>
						</div>
						<div class="table-td width270">
							<text class="table-text">{{item.Company}}</text>
						</div>
						<div class="table-td width220">
							<text class="table-text">{{item.CellPhone}}</text>
						</div>
						<div class="table-td width220">
							<text class="table-text">{{item.QQ}}</text>
						</div>
						<div class="table-td width220">
							<text class="table-text">{{item.CreateDate}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">待审核</text>
						</div>
					</div>
				</cell-slot>
			</recycle-list>
		</scroller>

	</div>

</template>

<script>
import { WxcPopover,WxcButton} from "weex-ui";
import API from "Utils/api";
const picker = weex.requireModule("picker");
var modal = weex.requireModule('modal')

export default {
  components: {
    WxcPopover,
    WxcButton
  },
  data() {
    return {
      listData: [],
      param: {phone: ''},
      showload: false,
      scrollType: "horizontal"
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
    },
    
  },
  created() {
    this.$router.getParams().then(resData => {
      this.init(resData);
    });
  },
  mounted() {},
  methods: {
    async getData() {
      var _this = this;
      // 做权限控制
      if (this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {
      } else {
        this.param = Object.assign(this.param, {
          DeliverPhone: this.userInfo.Mobile,
        });
      }
      var RES = await API.YJ_MemberAuditList(this.param);
      if (RES.Success) {
        this.listData = [];
        var DGDATA = RES.Data;
         if (DGDATA.length != 0) {
          DGDATA.map(item => {
            if(item.AuditStatus == 2){
              var date = item.CreateDate.split("T");
              item.CreateDate = `${date[0]} ${date[1]}`;
              this.listData.push(item);
            }
          });
        } else {
          this.$notice.toast({
            message: "暂无数据"
          });
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
      this.getData();
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
      this.getData();
    },
    searchBtn(){ 
      this.getData();
    },
    async toDetail(item,idx) {
      this.$router.open({
        name: "memberAuditDetail",
        params: item
      });
    },
    
  }
};
</script>
<style lang="sass" src='../contact/list.scss'></style>
<style lang="sass" scope>
  .table {width: 1450px;}
  .search-bar-left {
      width: 750px;
      height: 84px;
      /* padding-top: 35px; */
      background-color: #fff;
      flex-direction: row;
      color: #666666;
  }
  .search-text-box {
      flex-direction: row;
      align-items: center;
      width: 750px;
      height: 100px;
      line-height: 100px;
      /* color: #000; */
  }
  .search-bar-right-text {
      width: 300px;
      height: 50px;
      padding-left: 20px;
      margin: 0 20px;
      line-height: 50px;
      background-color: #f2f2f2;
      color: #7c7c7c;
      /*lines: 1;*/
      text-overflow: hidden;
      font-size: 28px;
  }
  .search-bar-left-text {
      width: 150px;
      color: #282828;
      font-size: 28px;
      text-align: right;
  }
  .search-bar-left-icon {
      margin-top: 5px;
      margin-left: 5px;
      width: 20px;
      height: 20px;
  }
</style>

