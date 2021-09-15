<template>
    <div>
     
        <div class="search-bar-left">
            <div class="search-text-box" >
                <text class="search-bar-left-text">会员号: </text>
                <input class="search-bar-right-text" v-model="param.userId" @return="searchBtn" type="number" return-key-type="search" placeholder="输入会员号">
                <wxc-button text="搜索" size="small" @wxcButtonClicked="searchBtn"></wxc-button>
            </div>
        </div>
         
		<scroller :scroll-direction="scrollType"
		          class="table"
		          @touchstart="ontouchstart">
      
			<div class="table-cell">
        <div class="table-td table-head">
					<text class="table-text">订单ID</text>
				</div>
        <div class="table-td table-head width270">
					<text class="table-text">产品名称</text>
				</div>
        <div class="table-td table-head">
					<text class="table-text">会员ID</text>
				</div>
				<div class="table-td table-head width270">
					<text class="table-text">店铺名</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">店铺ID</text>
				</div>
				<div class="table-td table-head width220">
					<text class="table-text">下单时间</text>
				</div>
				<div class="table-td table-head width270">
					<text class="table-text">会员收货地址</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">订单状态</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">配送方式</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">订单金额</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">运费</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">已付金额</text>
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
						<div class="table-td width270">
							<text class="table-text">{{item.ProductName}}</text>
						</div>
            <div class="table-td ">
							<text class="table-text">{{item.UserId}}</text>
						</div>
						<div class="table-td width270">
							<text class="table-text">{{item.ShopName}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.ShopId}}</text>
						</div>
						<div class="table-td width220">
							<text class="table-text">{{item.OrderDate}}</text>
						</div>
						<div class="table-td width270">
							<text class="table-text">{{item.RegionFullName}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.OrderStatusName}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.RemindtypeName}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.ProductTotalAmount}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.Freight}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.ReceivedAmount}}</text>
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
      param: {userId: ''},
      showload: false,
      scrollType: "horizontal"
    };
  },
  eros: {
    beforeBackAppear(params) {//回退信息
      //if(params.isRefresh){ //新增
        this.refresh();
      //}
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
      this.param.id = this.userInfo.adminId;
      this.$notice.loading.show("正在加载...");
      var RES = await API.YJ_GetVisitOrderList(this.param);
      this.$notice.loading.hide();
      if (RES.Success) {
        this.listData = [];
        var DGDATA = RES.Data;
        if (DGDATA.length != 0) {
        DGDATA.map(item => {
            var date = item.OrderDate.split("T");
            item.OrderDate = `${date[0]} ${date[1]}`;
            this.listData.push(item);
        });
        } else {
          this.$notice.toast({
            message: "已经到底部"
          });
        }
      }
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
    refresh() {
      this.getData();
    },
    searchBtn(){
      this.getData();
    },
    async toDetail(item,idx) {
      this.$router.open({
        name: "deliverGoodsDetail",
        params: item
      });
    },
    
  }
};
</script>
<style lang="sass" src='../contact/list.scss'></style>
<style lang="sass" scope>
  .table {width: 2250px;}
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

