<template>
    <div>
        <div class="visitBox">
            <div class="visit-left" @click="selectType">
                <div class="visit-box">
                    <text class="visit-left-text">项目:</text>
                    <text class="visit-right-text">{{selectPro.strName}}</text>
                    <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="visit-left-icon"></image>
                </div>
            </div>
             <div class="visit-left">
                <div class="visit-box">
                    <text class="visit-left-text">选择类型: </text>
                    <div class="selType">
                        <div :class="['selTypeBtn',inputIndex?'':'active']" @click="selectInputType(0)">手机号</div>
                        <div :class="['selTypeBtn',inputIndex?'active':'']" @click="selectInputType(1)">会员号</div>
                    </div>
                </div>
            </div>
            <div class="visit-left">
                <div class="visit-box">
                    <text class="visit-left-text">{{inputType}}号: </text>
                    <input class="visit-right-text" type="text" v-model="memberNum" :placeholder="`请输入${inputType}号`">
                </div>
            </div>
            <div class="button">
                <wxc-button size="big" text="查询" @wxcButtonClicked="searchBtn" class="searchBtn"></wxc-button>
            </div>
        </div>

       

        <wxc-popup popup-color="#eee"
               :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               height="800">
            <div class="resultBox">
                <text class="resText">查询结果</text>
                <div class="resultList">
                    <wxc-cell label="会员号" :title="member.Id">
                    </wxc-cell>
                    <wxc-cell label="公司名称" :title="member.Company">
                    </wxc-cell>
                    <wxc-cell label="地址" :title="member.Adress">
                    </wxc-cell>
                    <wxc-cell label="联系人" :title="member.Nick">
                    </wxc-cell>
                    <wxc-cell label="电话" :title="member.CellPhone">
                    </wxc-cell>
                </div>
            </div>
                    
            <div class="button">
                <wxc-button text="确定拜访" @wxcButtonClicked="contactSubmit" class="btnsub"></wxc-button>
            </div>
        </wxc-popup>
    </div>
</template>
<script>
	import { Utils  } from 'weex-ui'
	import Config from '../config.js'
    import API from 'Utils/api'
    import { WxcCell,WxcButton,WxcPopup} from "weex-ui";
	const picker = weex.requireModule('picker')

	export default {
        components: { WxcCell , WxcButton , WxcPopup }, 
		data () {
			return {
                statusBarHeight: weex.config.eros.statusBarHeight ? weex.config.eros.statusBarHeight : 40,
				selectPro : {
					strName: '请选择项目'
                },
                proIndex: -1,
				proList: [],
                memberNum: '',
                inputType: '手机',
                inputIndex: 0,
                inputList: ['手机', '会员'],
                userInfo: {},
                isBottomShow: false,
                member: {}
			}
        },
        mounted() {
            this.userInfo = API.get_userInfo(this);
            this.$navigator.setRightItem({
                text: '拜访记录',
                fontWeight: 'normal'
            }, () => {
                this.$router.open({
                    name: 'visitRecode',
                    type: "PUSH"
                });
            })
            this.getProjects(true);
        },
	    methods : {
            
            // 获取项目
            async getProjects (load) {
                if(load) {
                    this.$notice.loading.show('正在加载项目...');
                }
                const RES = await API.YJ_GETVISITPRO({})
                if(load) {
                    this.$notice.loading.hide();
                }
                if(RES.Success) {
                    var arr = []
                    RES.Data.map(item => {
                        item.strName = item.VisitItem;
                        item.Id = item.Id;
                        arr.push(item)
                    })
                    this.proList = arr;
                }
                
            },
            //选择项目
			selectType() {
				var items = [];
				if (items.length === 0) {
					this.proList.map(item => {
						items.push(item.strName);
					});
				}
				picker.pick(
					{
						index: this.proIndex,
						items
					},
					event => {
						if (event.result === "success") {
                            this.proIndex = event.data;
                            this.selectPro.strName = items[event.data]
						}
					}
				);
            },
            //选择输入类型
			selectInputType(idx) {
                if(idx == this.inputIndex) return;
                this.inputIndex = idx;
                this.inputType = this.inputList[this.inputIndex];
                this.memberNum = ''
            },
            // 查询
            searchBtn(){
                if(this.proIndex == -1){
                    this.$notice.toast({
						message: '请选择项目'
                    })
                    return;
                }
                if(this.memberNum == ''){
                    this.$notice.toast({
						message: this.inputIndex?'请输入会员号':'请输入手机号'
                    })
                    return;
                }
                var params = {};
                this.inputIndex?params.UserId=this.memberNum: params.Phone=this.memberNum;
                this.getSearchRes(params);
            },
            popupOverlayBottomClick(){
                this.isBottomShow = false;
            },
            // 获取查询结果
            async getSearchRes (params) {
                this.$notice.loading.show("正在查询")
                const RES = await API.YJ_GETVISITRES(params)
                if(RES.Success) {
                    this.member = RES.Data;
                    this.isBottomShow = true;
                }else{
                    this.$notice.toast({
						message: '查询失败，请重新输入'
                    })
                }
                this.$notice.loading.hide()
            },
            // 确认拜访
            async contactSubmit(){
                var params = {
                    UserId: this.memberNum,
                    VisitorId: this.userInfo.adminId,
                    ItemId: this.proList[this.proIndex].Id,
                }
                const RES = await API.YJ_GETVISITSUB(params);
                if(RES.Success) {
                   this.isBottomShow = false;
                   this.selectPro.strName = '请选择项目';
                   this.proIndex = -1;
                   this.memberNum = '';
                   this.$notice.toast({
						message: RES.Message
                    })
                }else{
                    this.$notice.toast({
						message: RES.Message
                    })
                }
            },
        }
	}
</script>
<style lang="scss" scoped>
    .visitBox{
        padding: 60px 20px;
        margin: 40px 20px;
        border-radius: 30px;
        background-color: #fff;
    }
    .visit-left {
        height: 100px;
        /* padding-top: 35px; */ 
        align-content: center;
        flex-direction: row;
        color: #666666;
    }
    .visit-box {
        flex-direction: row;
        align-items: center;
        height: 100px;
        line-height: 100px;
        /* color: #000; */
    }
    .visit-left-text{
        width: 130px;
        text-align: right;
    }
    .visit-right-text {
        margin-left: 20px;
        width: 460px;
        height: 70px;
        padding-left: 20px;
        line-height: 70px;
        background-color: #f2f2f2;
        color: #7c7c7c;
        lines: 1;
        text-overflow: hidden;
        font-size: 28px;
        border-radius: 10px;
    }
    .selType{display: flex;flex-direction: row;align-items: center;}
    .selTypeBtn{
        display: block;
        padding: 10px 30px;
        margin-left: 20px;
        font-size: 20px;
        border-width: 2px;
        border-color: #ddd;
        border-radius: 50px;
    }
    .active{
        border-color: #68b8f6;
        background-color: #68b8f6;
        color: #ffffff;
    }
    .visit-left-text {
        color: #282828;
        font-size: 28px;
    }
    .visit-left-icon {
        margin-top: 5px;
        margin-left: 5px;
        width: 20px;
        height: 20px;
    }
    .searchBtn{
		background-color: #68b8f6;
		border-radius: 150px;
    }
    .button{
        margin-top: 40px;
        width: 750px;
        display: flex;
		flex-direction: row;
        justify-content: center;
        color: #ffffff;
	}
    .resText{margin: 20px;}
    .resultList{
        background-color: #fff;
    }
</style>
