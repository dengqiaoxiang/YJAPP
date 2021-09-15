<template>
    <list ref="scrollerList">
        <cell>
            <scroller>
                <wxc-cell 
                    label="会员号"
                    :title="listItem.UserId">
                </wxc-cell>
                <wxc-cell 
                    label="会员名"
                    :title="listItem.UserName">
                </wxc-cell>
                <wxc-cell 
                    label="公司名称"
                    :title="listItem.Company">
                </wxc-cell>
                <wxc-cell 
                    label="手机"
                    :title="listItem.Phone">
                </wxc-cell>
                <wxc-cell 
                    label="QQ"
                    :title="listItem.QQ">
                </wxc-cell>
                <wxc-cell 
                    label="所属区域经理"
                    :title="listItem.ManagerName">
                </wxc-cell>
                <wxc-cell 
                    label="所属业务员"
                    :title="listItem.SalesmanName">
                </wxc-cell>
                <wxc-cell 
                    label="所属配送员"
                    :title="listItem.DistributorName">
                </wxc-cell>
                <div class="address">
                    <text class="address-tip">地址</text>
                    <text class="address-text">{{listItem.Address}}</text>
                </div>
                <wxc-cell 
                    label="创建时间"
                    :title="listItem.CreateDate ">
                </wxc-cell>
                <div style="height: 100px"></div>
            </scroller>
          </cell>
          
    </list>
</template>
<script>
import { WxcCell , WxcSimpleFlow , WxcButton } from 'weex-ui'
import API from 'Utils/api'
const picker = weex.requireModule("picker");
export default {
    components: { WxcCell , WxcButton ,picker}, 
    data () {
        return {
            listItem: {},
            distributorIdx: -1,
            distributors: [],
            salesmanIdx: -1,
            salesmans: [],
            adminIdx: -1,
            admins: [],
            YJDefaultRegion: '', //详情地址
            RegionId: null, //街道ID
            aduitCtn: ''
        }
    },
    eros: {
        beforeAppear(params, options ) {
            this.listItem = params;
            this.GetUserAddressInfo({id: params.Id});
        }
    },
    computed: {
        userInfo() {
            var userInfo = API.get_userInfo(this);
            return userInfo;
        }
    },
    methods: {
        async GetUserAddressInfo(params){
            var RES = await API.YJ_GetUserAddressInfo(params);
            this.YJDefaultRegion = RES.Data.YJDefaultRegion;
            this.RegionId = RES.Data.RegionId;
        }
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
    .address{
        padding: 23px;
        background-color: #fff;
        border-bottom-color: #ddd;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }
    .address-tip{
        color: #666;
    }
    .address-text{
        margin-top: 20px;
        display: flex;
        width: 700px;
        height: 120px;
    }
    .button{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        width: 750px;
        margin: 30px auto;
    }
    .noBtn{margin-top: 20px;}
    .aduit-ctn{color: #000}
</style>

