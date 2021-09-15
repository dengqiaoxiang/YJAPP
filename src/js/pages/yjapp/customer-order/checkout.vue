<template>
    <scroller>
        <wxc-cell 
            label="会员号"
            :title="detail.userId"
            :cell-style="cellStyle">
        </wxc-cell>
        <wxc-cell
            label="名称"
            :title="address.ShipTo"
            :cell-style="cellStyle">
        </wxc-cell>
        <wxc-cell
            label="电话"
            :title="address.Phone"
            :cell-style="cellStyle">
        </wxc-cell>
        <div class="content">
            <text class="text">收货地址</text>
            <div class="textarea">
                <text>{{address.Province}}{{address.City}}{{address.Area}}{{address.Street}}{{address.Address}}</text>
            </div>
        </div>
        <div class="content">
            <text class="text">产品名称</text>
            <div>
                <text>{{detail.title}}</text>
            </div>
        </div>
        <template v-if="detail.number>0">
            <template v-for="item in detail.skuArr">
                <wxc-cell v-if="item.value" :label="item.title" :title="item.value" :cell-style="cellStyle">
                </wxc-cell>
            </template>
            <wxc-cell
                label="数量"
                :title="detail.number"
                :cell-style="cellStyle">
            </wxc-cell>
            <wxc-cell
                label="价格"
                :title="detail.price"
                :cell-style="cellStyle">
            </wxc-cell>
        </template>
        <template v-else>
            <wxc-cell v-for="(item,index) in detail.paraStr" :key="index"
                :label="item.name"
                :title="item.value"
                :cell-style="cellStyle">
            </wxc-cell>
            <wxc-cell
                label="价格"
                :title="detail.bjPrice"
                :cell-style="cellStyle">
            </wxc-cell>
        </template>
        
        <div class="content">
            <text class="text">备注</text>
            <textarea name="" id="" cols="30" rows="4" class="textarea" v-model="remark" placeholder="请输入"></textarea>
        </div>
        
        <div class="top-three-top"></div>
        <div class="bottom-btn">
            <wxc-button text="确定" type="red"
                @wxcButtonClicked="handle" class="one"></wxc-button>
        </div>
    </scroller>
</template>
<script>
import { WxcCell , WxcButton } from 'weex-ui'
import API from 'Utils/api'
const picker = weex.requireModule("picker");
export default {
    components: { WxcCell , WxcButton ,picker}, 
    data () {
        return {
            detail: {},
            address: {},
            remark: '',
            cellStyle: {
                height: 80
            },
        }
    },
    eros: {
        beforeAppear(params, options ) {
            this.detail = params;
            this.address = params.address;
        }
    },
    methods: {
        async handle () {
            var address = this.address;
            var detail = this.detail;
            var params = {
                VisitItemId: detail.visitItemId,
                skuIds: detail.skuIds,
                counts: detail.number>0?detail.number:detail.pcount,
                recieveAddressId: address.Id,
                userid: detail.userId,
                VisitId: detail.VisitId,
                CostPrice: (detail.costPrice * detail.number) || '', 
                Price: (detail.price * detail.number) || detail.bjPrice,
                SenderAddress: address.Province+address.City+address.Area+address.Street+address.Address,
                orderRemarks: this.remark,
                TypeStr: detail.number>0 ? detail.skuArr[6].value : '',
                QuoteStr: detail.quoteStr || '',
                QuoteLogId: detail.quoteLogId || '',
                GroupJson: detail.groupJson || '',
            }

            params.Color = detail.number>0 ? detail.skuArr[0].value : '';
            params.Size = detail.number>0 ? detail.skuArr[1].value : '';
            params.Version = detail.number>0 ? detail.skuArr[2].value : '';
            params.Material = detail.number>0 ? detail.skuArr[3].value : '';
            params.Fashion = detail.number>0 ? detail.skuArr[4].value : '';
            params.Grams = detail.number>0 ? detail.skuArr[5].value : '';
            params.Ensemble = detail.number>0 ? detail.skuArr[6].value : '';

            var RES = await API.YJ_JYAppSaveOrderInfo(params);
            if(RES.Success){
                this.$notice.toast({
					message: ''+RES.Message+''
                })
                let len = detail.number>0 ? 2:3
                this.$router.back({length: len})
            }
        }
    },
    mounted () {

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
	.text{line-height: 50px;color: #666;}
	.textarea{
		display: block;
        min-height: 160px;
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
        background-color: #fff;;
        box-shadow: 0 0 10px #eee;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
    .one{margin: 16px 0;}
    .two{
        border-radius: 0;
        width: 375px;
    }
</style>

