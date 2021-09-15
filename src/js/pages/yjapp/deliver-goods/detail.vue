<template>
    <scroller>
        <wxc-cell 
            label="订单ID"
            :title="listItem.Id">
        </wxc-cell>
        <wxc-cell 
            label="产品名称"
            :title="listItem.ProductName">
        </wxc-cell>
        <wxc-cell 
            label="会员ID"
            :title="listItem.UserId">
        </wxc-cell>
        <wxc-cell 
            label="店铺名"
            :title="listItem.ShopName">
        </wxc-cell>
        <wxc-cell 
            label="店铺ID"
            :title="listItem.ShopId">
        </wxc-cell>
        <wxc-cell 
            label="下单时间"
            :title="listItem.OrderDate">
        </wxc-cell>
        <div class="content" >
            <text class="text">会员收货地址</text>
            <div class="textarea">
                <text>{{listItem.RegionFullName}}</text>
            </div>
        </div>
        <wxc-cell 
            label="订单状态"
            :title="listItem.OrderStatusName">
        </wxc-cell>
        <wxc-cell 
            label="配送方式"
            :title="listItem.RemindtypeName ">
        </wxc-cell>
        <wxc-cell 
            label="订单金额"
            :title="listItem.ProductTotalAmount">
        </wxc-cell>
        <wxc-cell label="运费"
                :title="listItem.Freight">
        </wxc-cell>
        
        <wxc-cell 
            label="已付金额"
            :title="listItem.ReceivedAmount">
        </wxc-cell>
        <div class="top-three-top"></div>
        <div class="bottom-btn">
            <wxc-button text="修改价格" type="blue" @wxcButtonClicked="changePrice" class="two"></wxc-button>
            <wxc-button text="确定收货" @wxcButtonClicked="handle" class="two"></wxc-button>
        </div>

        <wxc-mask height="300"
              width="500"
              border-radius="20"
              duration="200"
              mask-bg-color="#FFFFFF"
              :has-animation="hasAnimation"
              :has-overlay="true"
              :show-close="true"
              :show="show"
              @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="modifyPrice">
                <input type="number" v-model="modifyPrice" placeholder="请输入价格" class="modifyPriceIpt">
                <div class="button">
                    <wxc-button text="确定修改" size="medium" @wxcButtonClicked="surePrice" class="modifyPriceBtn"></wxc-button>
                </div>
            </div>
        </wxc-mask>
    </scroller>
</template>
<script>
import { WxcCell , WxcSimpleFlow , WxcButton , WxcMask } from 'weex-ui'
import API from 'Utils/api'
const picker = weex.requireModule("picker");
export default {
    components: { WxcCell , WxcButton ,picker,WxcMask}, 
    data () {
        return {
            listItem: {},
            show: false,
            hasAnimation: true,
            modifyPrice: ''
        }
    },
    eros: {
        beforeAppear(params, options ) {
            this.listItem = params;
        }
    },
    computed: {
        userInfo() {
            var userInfo = API.get_userInfo(this);
            return userInfo;
        }
    },
    methods: {
        changePrice(){
            this.show = true;
            this.hasAnimation = true;
        },
        wxcMaskSetHidden () {
            this.show = false;
        },
        async surePrice(){
            if(this.modifyPrice < this.listItem.ProductTotalAmount){
                this.$notice.toast({
					message: '价钱不能低于'+this.listItem.ProductTotalAmount+''
                })
                return;
            }
            var params = {
                OrderId: this.listItem.Id,
                NewPrice: this.modifyPrice,
                Operator: this.userInfo.adminId
            }
            this.$notice.loading.show("正在修改...");
            var RES = JSON.parse(await API.YJ_ChangeOrderPrice(params));
            this.$notice.loading.hide();
            if(RES.code == 'OK'){
                this.$notice.toast({
					message: ''+RES.msg+''
                })
                this.listItem.ProductTotalAmount = (this.modifyPrice).toFixed(2);
                this.show = false;
            }else{
                 this.$notice.toast({
					message: ''+RES.msg+''
                })
            }
        },
        async handle () {
            var params = {
                OrderId: this.listItem.Id,
                VisitId: this.userInfo.adminId
            }
            this.$notice.loading.show("正在确认...");
            var RES = await API.YJ_UpdOrderStatusByVisit(params);
            this.$notice.loading.hide();
            this.$notice.toast({message: ''+RES.Message+''})
            if(RES.Success){
                this.$router.setBackParams({isRefresh: true})
                this.$router.back()
            }
        },
    },

}
</script>
<style>
	.content{
		font-size: 30px; 
		padding: 16px 22px;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #ddd;
		background-color: #fff;
	}
	.text{line-height: 70px;color: #666;}
	.textarea{
		display: block;
        min-height: 200px;
		font-size: 30px; 
		color: #0b244c;
		padding: 16px;
		background-color: #eee;
	}
	.top-three-top {
        width: 750px;
        height: 200px;
	}
	.bottom-btn {
        position: fixed;
        bottom: 0;
        left: 0;
		width: 750px;
		border-top-width: 1px;
		border-top-style: solid;
		border-top-color: #E5E5E5;
        background-color: #fff;
        box-shadow: 0 0 10px #eee;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
    .two{
        border-radius: 0;
        width: 375px;
    }
    .modifyPrice{
        padding: 30px;
    }
    .modifyPriceIpt{
        display: block;
        margin: 20px auto 40px;
        padding: 16px 20px;
        background-color: #eee;
        border-radius: 8px;
    }
    .button{
        flex-direction: row;
        justify-content: center;
    }
    .modifyPriceBtn{
        background-color: #68b8f6;
		border-radius: 150px;
    }
</style>

