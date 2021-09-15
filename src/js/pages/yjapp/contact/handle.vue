<template>
	<div class="box">
		<div class="add-box">
            <div class="add-textarea" >
				<text class="text">问题内容</text>
				<div class="textarea">
					<text>{{handleMsg.ctn}}</text>
				</div>
			</div>
            <div class="add-input" @click="selectType">
				<text class="text">处理结果</text>
				<text class="my-input">{{typeList[typeIndex].strName}}</text>
			</div>
			<div class="add-textarea" >
				<text class="text">处理内容</text>
				<div class="textarea">
					<textarea v-model="content" :disabled="disabled" rows="10" placeholder="处理内容" maxlength="500" class="handleCtn">
					</textarea>
				</div>
			</div>
		</div>
		<div class="button">
			<wxc-button :disabled="disabled" text="确定"  @wxcButtonClicked="handleSubmit">
			</wxc-button>
		</div>
	</div>
</template>
<script>
	import { WxcButton } from "weex-ui";
	import API from 'Utils/api'
	const picker = weex.requireModule("picker");
	export default {
		data () {
			return  {
				handleMsg: {},
				content: '',
				//选择类型
                disabled: false,
				typeIndex: 1,
				typeList: [
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
				]
			}
		},
		components: {
			WxcButton
		},
		beforeCreate: function () {
            
		},
		eros: {
			beforeAppear(params, options ) {
				this.handleMsg = params;
			}
		},
		mounted () {
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
                            event.data == 0 ? this.disabled = true:this.disabled = false;
						}
					}
				);
			},
            async handleSubmit(){
				if(this.content === '' && this.typeIndex != 2){
					this.$notice.toast("处理内容不能为空")
					return;
				}
				try {
					//this.$notice.loading.show("正在提交")
					var msg = {
						Id: this.handleMsg.id,
						HandlerResult: this.content,
						HandlerType: this.typeList[this.typeIndex].strName
					}
					const RES = await API.KIY_HandleContact(msg)
					this.$notice.loading.hide()
					this.$router.setBackParams({
                        isRefresh: true
                    })
                    this.$router.back({ length: 2})
				} catch (e) {
					this.$notice.toast({
						message: e.Message
					})
				}
            }
		}
	}
</script>
@import 'src/js/css/base';
<style scoped lang="scss">
	.box{
		padding: 40px 30px 0;
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
		font-size: 30px; 
		color: #000;
		padding: 16px;
		background-color: #f3e9e9;
		border-radius: 6px;
	}
	.handleCtn{
		height: 250px;
		color: #000;
	}
	.button{
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 70px;
	}
	
</style>
