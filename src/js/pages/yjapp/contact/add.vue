<template>
	<div class="box">
		<div class="add-box">
			<div class="add-textarea" >
				<text class="text">问题内容</text>
				<div class="textarea">
					<textarea v-model="content" rows="10" placeholder="请填写问题内容" maxlength="500" class="textarea-ipt">
					</textarea>
				</div>
			</div>
			<div class="add-input" @click="selectType">
				<text class="text">类型</text>
				<text class="my-input">{{typeList[typeIndex].strName}}</text>
			</div>
			<div class="add-input" @click="selectDepartment">
				<text class="text">收件部门</text>
				<text class="my-input">{{departmentName}}</text>
			</div>
		</div>
		<div class="button">
			<wxc-button text="确定" @wxcButtonClicked="contactSubmit" class="btnsub">
			</wxc-button>
		</div>
	</div>
</template>
<script>
	import { WxcButton } from "weex-ui";
	import API from "Utils/api";
	const picker = weex.requireModule("picker");
	export default {
		data () {
			return  {
				content: '',
				 //选择类型
				typeIndex: 0,
				typeList: [
					{
						strName: "正常",
						Id: 1
					},
					{
						strName: "紧急",
						Id: 2
					}
				],
				departmentName: '请选择',
				departmentIdx: -1,
				department: []
			}
		},
		components: {
			WxcButton
		},
		beforeCreate: function () {
            
		},
		computed: {
			userInfo() {
			var userInfo = API.get_userInfo(this);
				return userInfo;
			}
		},
		mounted () {
			this.getDepartment();
		},
		methods : {
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
						}
					}
				);
			},
			//获取部门
			async getDepartment(){
				var RES = await API.KIY_DEPARTMENTLIST({});
				if(RES.Success){
					this.department = RES.Data;
				}
			},
			//选择部门
			selectDepartment(){
				var items = [];
				if (items.length === 0) {
					this.department.map(item => {
						items.push(item.Name);
					});
				}

				picker.pick(
					{
						index: this.departmentIdx,
						items
					},
					event => {
						if (event.result === "success") {
							this.departmentIdx = event.data;
							this.departmentName = this.department[event.data].Name;
						}
					}
				);
			},
			//提交信息
			async contactSubmit(){
				var param = {};
				if(this.departmentIdx === 0){
					this.$notice.toast({
						message: '请选择部门'
					})
					return;
				}
				if(this.content === ''){
					this.$notice.toast({
						message: '请填写问题内容'
					})
					return;
				}
				param.SenderId = this.userInfo.adminId;
				param.SendType = this.typeList[this.typeIndex].strName;
				param.DepartId = this.department[this.departmentIdx].Id
				param.LiaisonContent = this.content;
				this.$notice.loading.show("正在提交");
				console.log(param);
				var RES = await API.KIY_ADDCONTACT(param);
				this.$notice.loading.hide();
				if(RES.Success){
					this.$router.setBackParams({
						isRefresh: true
					})
					this.$router.back()
				}else{
					this.$notice.toast({
						message: ''+RES.Message+''
					})
				}
				
			}
		}
	}
</script>
@import 'src/js/css/base';
<style scoped lang="scss">
	.box{
		padding: 50px 30px 0;
	}
    .add-box{
		border-radius: 30px;
		box-shadow: 0 0 20px #888;
		background-color: #fff;
	}
	.add-input{
		display: flex;
		flex-direction: row;
		padding: 10px 20px;
	    border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #ddd;
	}
	.text{
		width: 200px;
		height:74px; 
		line-height: 74px;
		font-size: 34px; 
		text-align: left;
		color: #666;
	}
	.typeRadio{
		display: flex;
		flex-direction: row;
	}
	.my-input{
		width:505px; 
		height:74px; 
		line-height: 74px;
		font-size: 34px; 
		color: #2e2e2e ;
	}
	.default{color: #eee;}
	.add-textarea{
		font-size: 30px; 
		padding: 15px 20px;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #ddd;
	}
	.textarea{
		display: block;
		min-height: 250px;
		font-size: 30px; 
		color: #000;
		padding: 16px;
		background-color: #f3e9e9;
		border-radius: 6px;
	}
	.textarea-ipt{
		display: block;
		height: 250px;
		color: #000;
	}
	.button{
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 70px;
	}
	.btnsub{
		width: 600px;
		background-color: #68b8f6;
		border-radius: 150px;
	}
</style>
