<template>
    <list ref="scrollerList">
        <cell>
            <scroller>
                <wxc-cell 
                    label="会员号"
                    :title="listItem.Id">
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
                    :title="listItem.CellPhone">
                </wxc-cell>
                <wxc-cell 
                    label="QQ"
                    :title="listItem.QQ">
                </wxc-cell>
                <div class="address">
                    <text class="address-tip">地址</text>
                    <text class="address-text">{{YJDefaultRegion}}</text>
                </div>
                <wxc-cell 
                    label="创建时间"
                    :title="listItem.CreateDate ">
                </wxc-cell>
                <wxc-cell v-if="listItem.AuditStatus==2" label="审核状态" title="待审核">
                </wxc-cell>
                <wxc-cell  label="所属配送员" :title="distributorIdx==-1?'请选择':distributors[distributorIdx].RealName" 
                    @wxcCellClicked="selectDistributor">
                </wxc-cell>
                 <wxc-cell label="所属业务员" :title="salesmanIdx==-1?'请选择':salesmans[salesmanIdx].RealName" 
                    @wxcCellClicked="selectSaleman">
                </wxc-cell>
                 <wxc-cell label="所属管理者" :title="adminIdx==-1?'请选择':admins[adminIdx].RealName" @wxcCellClicked="selectAdmin">
                </wxc-cell>
                <div class="address">
                    <text class="address-tip">审核内容</text>
                    <textarea name="" id="" cols="30" rows="5" placeholder="审核内容" v-model="aduitCtn" class="aduit-ctn"></textarea>
                </div>
                <div class="button">
                    <wxc-button text="通过" type="blue" @wxcButtonClicked="saveAuditMember(0)">
                    </wxc-button>
                    <wxc-button text="不通过" @wxcButtonClicked="saveAuditMember(1)" class="noBtn">
                    </wxc-button>
                </div>
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
        //获取配送员、业务员、区域经理列表
        async GetFPAdminUserList(){
            var RES = await API.YJ_GetFPAdminUserList({});
            if(RES.Success){
                 RES.Data.map(item => {
                    if(item.RoleId == 8 || item.RoleId == 9 || item.RoleId == 13){
                         this.distributors.push(item);
                     }
                     if(item.RoleId == 23){
                         this.salesmans.push(item);
                     }
                     if(item.RoleId == 1 || item.RoleId == 11){
                         this.admins.push(item);
                    }
                })
            }
        },
        async GetUserAddressInfo(params){
            var RES = await API.YJ_GetUserAddressInfo(params);
            this.YJDefaultRegion = RES.Data.YJDefaultRegion;
            this.RegionId = RES.Data.RegionId;
        },
        selectDistributor(){
            var _this = this;
            var distributors = this.distributors;
            var items = [];
            if(items.length === 0){
                distributors.map(item => {
                    items.push(item.RealName)
                })
            }
            picker.pick({
                index: this.distributorIdx,
                items
            }, event => {
                if (event.result === 'success') {
                    _this.distributorIdx = event.data;
                    var params = {
                        AssignUserId: distributors[event.data].Id,
                        AssignUserName: distributors[event.data].RealName,
                        TypeValue: 2
                    }
                    this.saveAssignUsers(params)
                }
            })
        },
        selectSaleman(){
            var _this = this;
            var salesmans = this.salesmans;
            var items = [];
            if(items.length === 0){
                salesmans.map(item => {
                    items.push(item.RealName)
                })
            }
            picker.pick({
                index: this.salesmanIdx,
                items
            }, event => {
                if (event.result === 'success') {
                    _this.salesmanIdx = event.data;
                    var params = {
                        AssignUserId: salesmans[event.data].Id,
                        AssignUserName: salesmans[event.data].RealName,
                        TypeValue: 1
                    }
                    this.saveAssignUsers(params)
                }
            })
        },
        selectAdmin(){
            var _this = this;
            var admins = this.admins;
            var items = [];
            if(items.length === 0){
                admins.map(item => {
                    items.push(item.RealName)
                })
            }
            picker.pick({
                index: this.adminIdx,
                items
            }, event => {
                if (event.result === 'success') {
                    _this.adminIdx = event.data;
                    var params = {
                        AssignUserId: admins[event.data].Id,
                        AssignUserName: admins[event.data].RealName,
                        TypeValue: 3
                    }
                    this.saveAssignUsers(params)
                }
            })
        },
        async saveAssignUsers(msg){
            var params = {
                UserId: this.listItem.Id
            }
            params = Object.assign(params,msg)
            var RES = await API.YJ_SaveAssignUsers(params); 
            if(!RES.Success){
                if(msg.TypeValue == 1){
                    this.salesmanIdx = -1
                }else if(msg.TypeValue == 2){
                    this.distributorIdx = -1
                }else{
                    this.adminIdx = -1
                }
                this.$notice.toast({
					message: '选择保存失败，请重选'
				})
            }
        },
        async saveAuditMember(type){
            if(type == 0){
                // if(this.salesmanIdx == -1){
                //     this.$notice.toast({message: '请选择所属业务员'});
                //     return;
                // }
                // if(this.distributorIdx == -1){
                //     this.$notice.toast({message: '请选择所属配送员'});
                //     return; 
                // } 
                // if(this.adminIdx == -1){
                //     this.$notice.toast({message: '请选择所属管理者'});
                //     return;
                // }
                if(this.aduitCtn == ''){
                    this.aduitCtn = '审核通过'
                }
            }else{
                if(this.aduitCtn == ''){
                    this.$notice.toast({message: '请填写审核内容'});
                    return;
                }
            }
            var userInfo = this.userInfo;
            var params = {
                UserId: this.listItem.Id,
                AuditStatus: type,
                AuditReason: this.aduitCtn,
                AuditManagerId: userInfo.adminId,
                AuditManagerName: userInfo.RealName
            }
            var RES = await API.YJ_SaveAuditMember(params);
            if(RES.Success){
                this.$notice.toast({
					message: '保存成功'
                })
                this.$router.setBackParams({isRefresh: true})
                this.$router.back()
            }
        }
    },
    mounted() {
        this.GetFPAdminUserList();
    },
    created () {
        
    }

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

