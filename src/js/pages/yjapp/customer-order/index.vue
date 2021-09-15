<template>
    <scroller class="scroller">
		
        <div class="box">
            <div class="add-box">
				<div class="selItem" @click="selectType">
					<text class="text">产品名称</text>
					<div class="selType">
						<text class="title">{{typeList[typeIndex].strName}}</text>
						<image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
					</div>
                </div>
				<template v-if="!isQid">
					<div class="selItem" v-if="Color.length">
						<text class="text">{{Color[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="colorStyles.cols"
							:customStyles="colorStyles"
							:list="Color"
							@select="params => onSelect(0, params)">
						</wxc-grid-select>
					</div>
					<div class="selItem" v-if="Size.length">
						<text class="text">{{Size[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="sizeStyles.cols"
							:customStyles="sizeStyles"
							:list="Size"
							@select="params => onSelect(1, params)">
						</wxc-grid-select>
					</div>
					<div class="selItem" v-if="Version.length">
						<text class="text">{{Version[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="versionStyles.cols"
							:customStyles="versionStyles"
							:list="Version"
							@select="params => onSelect(2, params)">
						</wxc-grid-select>
					</div>
					<div class="selItem" v-if="Material.length">
						<text class="text">{{Material[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="materialStyles.cols"
							:customStyles="materialStyles"
							:list="Material"
							@select="params => onSelect(3, params)">
						</wxc-grid-select>
					</div>
					<div class="selItem" v-if="Fashion.length">
						<text class="text">{{Fashion[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="fashionStyles.cols"
							:customStyles="fashionStyles"
							:list="Fashion"
							@select="params => onSelect(4, params)">
						</wxc-grid-select>
					</div>
					<div class="selItem" v-if="Grams.length">
						<text class="text">{{Grams[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="gramsStyles.cols"
							:customStyles="gramsStyles"
							:list="Grams"
							@select="params => onSelect(5, params)">
						</wxc-grid-select>
					</div>
					<div class="selItem" v-if="Ensemble.length">
						<text class="text">{{Ensemble[0].Name}}</text>
						<wxc-grid-select
							:single="true"
							:cols="ensembleStyles.cols"
							:customStyles="ensembleStyles"
							:list="Ensemble"
							@select="params => onSelect(6, params)">
						</wxc-grid-select>
					</div>
					<div class="add-input">
						<text class="text">价钱</text>
						<text class="price">￥{{price}}</text>
					</div>
					<div class="add-input">
						<text class="text">数量</text>
						<wxc-stepper :default-value="number"
							:max="stock"
							min="1"
							@wxcStepperValueChanged="stepperValueChange"></wxc-stepper>
						<text class="text text-center">库存</text>
						<text class="text">{{stock}}{{typeList[typeIndex].measureUnit}}</text>
					</div>
				</template>
				<template v-else>
					<div v-if="baojiaRes.quoteLogId" @click="toBaojia">
						<div class="add-input" v-for="(item,index) in paraStr" :key="index">
							<text class="text">{{item.name}}</text>
							<text class="price">{{item.value}}</text>
						</div>
						<div class="add-input">
							<text class="text">价钱</text>
							<text class="price">￥{{baojiaRes.price}}</text>
						</div>
					
					</div>
				</template>
				
				<div class="add-input">
                    <text class="text">会员号</text>
                    <input type="number" v-model="customerNumer" class="my-input" placeholder="请输入会员号">
                </div>
            </div>
            <div class="button">
                <wxc-button :text="isQid?'重新报价':'确定'" @wxcButtonClicked="contactSubmit" class="btnsub">
                </wxc-button>
            </div>
        </div>
    </scroller>
</template>
<script>
	import { WxcButton,WxcGridSelect,WxcStepper } from "weex-ui";
	import API from "Utils/api";
	const picker = weex.requireModule("picker");
	import id27 from "./components/id27.vue";
	export default {
		components: {
            WxcButton,
			WxcGridSelect,
			WxcStepper,
			id27
		},
		data () {
			return  {
				isQid: false,
				who: '',
				qidData: [12,122],
				content: '',
				 //选择类型
				typeIndex: 0,
				typeList: [],
				colorStyles: {width: '150px',height: '60px',cols: 4},
				sizeStyles: {width: '150px',height: '60px',cols: 4},
				versionStyles: {width: '150px',height: '60px',cols: 4},
				materialStyles: {width: '150px',height: '60px',cols: 4},
				fashionStyles: {width: '150px',height: '60px',cols: 4},
				gramsStyles: {width: '150px',height: '60px',cols: 4},
				ensembleStyles: {width: '150px',height: '60px',cols: 4},
				productData: {},
                Color: [],
                Size: [],
                Version: [],
                Material: [],
                Fashion: [],
                Grams: [],
                Ensemble: [],
				skuArr: [
					{idx:0,checked: true,value: ''},
					{idx:0,checked: true,value: ''},
					{idx:0,checked: true,value: ''},
					{idx:0,checked: true,value: ''},
					{idx:0,checked: true,value: ''},
					{idx:0,checked: true,value: ''},
					{idx:0,checked: true,value: ''}
				],
				skuNum: 0,
				skuIds: [],
				price: 0,
				stock: 0,
				costPrice: 0,
				number: 1,
				customerNumer: '',
				baojiaRes: {},
				paraStr: []
			}
		},
		computed: {
			userInfo() {
				var userInfo = API.get_userInfo(this);
				return userInfo;
			}
		},
		methods : {
			// 获取产品信息
			async getProductByDetail(){
				const RES = await API.YJ_GetProductByDetail({})
				if(RES.Success){
					var resData = RES.Data
					if(!resData || resData.length == 0){return;}
					this.productData = resData;
					var protype = [];
					for(var i in resData){
						protype.push({
							strName: resData[i].ProductName,
							id: resData[i].ProductId,
							qid: resData[i].QitemCode,
							fid: resData[i].ShopId,
							visitItemId: resData[i].VisitItemId,
							measureUnit: resData[i].MeasureUnit
						})
					}
					this.typeList = protype;
					if(resData[0].QitemCode){
						let params = {
							Qid: resData[0].QitemCode,
							fid: resData[0].ShopId,
							visitItemId: protype[0].visitItemId,
							title: protype[0].strName,
							productId: protype[0].id
						}
						this.$router.open({
							name: "id"+resData[0].QitemCode,
							type: "PUSH",
							params: params
						});
						this.baojiaParams = params;
						this.isQid = true;
						this.who = 'id'+resData[0].QitemCode;
					}else{
						this.selProduct(resData[0])
					}
					
				}else{
					this.$notice.toast({message: '请求失败，请重试'})
				}
				
			},
			// 规格循环
			skuFor(arr,style){
				var lastArr = [];
				if(arr.length>0){
					for(var i in arr){
						if(i == 0){
							arr[i].checked = true;
							this.skuIds.push(arr[i].SkuId);
						}
						arr[i].title = arr[i].Value
						lastArr.push(arr[i])
					}
					if(arr[0].Value.length<=8){
						style.width = '150px';
						style.cols = '4'
					}
					if(arr[0].Value.length>8){
						style.width = '210px';
						style.cols = '3'
					}
					if(arr[0].Value.length>13){
						style.width = '320px';
						style.cols = '2'
					}
					this.skuArr[this.skuNum].title = arr[0].Name;
					this.skuArr[this.skuNum].value = arr[0].Value;
				}else{
					this.skuIds.push(0);
				}
				this.skuNum++;
				return lastArr;
			},
			// 产品选择
			selProduct(curData){
				this.Color = this.skuFor(curData.Color,this.colorStyles);
				this.Size = this.skuFor(curData.Size,this.sizeStyles);
				this.Version = this.skuFor(curData.Version,this.versionStyles);
				this.Material = this.skuFor(curData.Material,this.materialStyles);
				this.Fashion = this.skuFor(curData.Fashion,this.fashionStyles);
				this.Grams = this.skuFor(curData.Grams,this.gramsStyles);
				this.Ensemble = this.skuFor(curData.Ensemble,this.ensembleStyles);
				var selSkuId = curData.ProductId+'_'+this.skuIds.join('_');
				for(var i in curData.Skuinfos){
					if(curData.Skuinfos[i].SkuId == selSkuId){
						this.price = curData.Skuinfos[i].Price;
						this.stock = curData.Skuinfos[i].Stock;
						this.costPrice = curData.Skuinfos[i].CostPrice;
					}
				}
			},
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
							this.skuNum = 0;
							let current = this.typeList[event.data];
							for(var i in this.skuArr){
								this.skuArr[i].idx = 0;
								this.skuArr[i].checked = true;
								this.skuArr[i].value = '';
							}
							this.skuIds = [];
							if(current.qid){
								let params = {
									Qid: current.qid,
									fid: current.fid,
									visitItemId: current.visitItemId,
									title: current.strName,
									productId: current.id
								}
								this.$router.open({
									name: "id"+current.qid,
									type: "PUSH",
									params: params
								});
								this.baojiaParams = params;
								this.isQid = true;
								this.who = 'id'+current.qid;
							}else{
								this.isQid = false;
								this.selProduct(this.productData[event.data])
							}
							
						}
					}
				);
            },
            onSelect(res, {selectIndex, checked, checkedList}){
				this.skuArr[res].idx = selectIndex;
				this.skuArr[res].checked = checked;
				var productData = this.productData;
				var typeIndex = this.typeIndex;
				if(checked){
					this.skuIds[res] = checkedList[0].SkuId;
					this.skuArr[res].value = checkedList[0].Value;
					var skuinfos = productData[typeIndex].Skuinfos;
					var selSkuId = productData[typeIndex].ProductId+'_'+this.skuIds.join('_');
					for(var i in skuinfos){
						if(skuinfos[i].SkuId == selSkuId){
							this.price = skuinfos[i].Price;
							this.stock = skuinfos[i].Stock;
							this.costPrice = skuinfos[i].CostPrice;
							return;
						}
						if(skuinfos[i].SkuId != selSkuId){
							this.stock = 0;
						}
					}
				}
			},
			stepperValueChange(e){
				if(e.value != ''){
					this.number = e.value;
				}
			},
			//提交信息
			async contactSubmit(){
				// 非标品
				if(this.isQid && !this.baojiaRes.quoteLogId){
					this.$router.open({
						name: ''+this.who+'',
						type: "PUSH",
						params: this.baojiaParams
					});
					return;
				}
				for(var i in this.skuArr){
					if(!this.skuArr[i].checked){
						this.$notice.toast({
							message: '请选择'+this.skuArr[i].title+''
						})
						return;
					}
				}
				if(this.number == ''){
					this.$notice.toast({
						message: '请输入数量'
					})
					return;
				}
				if(this.number > this.stock){
					this.$notice.toast({
						message: '数量不能大于库存'
					})
					return;
				}
				
				if(this.customerNumer === ''){
					this.$notice.toast({
						message: '请填写会员号'
					})
					return;
				}
				var userInfo = API.get_userInfo(this);
				var curType = this.typeList[this.typeIndex];
				let RES = await API.YJ_GetUserAddressByUserId({
					Id: userInfo.adminId,
					userId: this.customerNumer,
					VisitItemId: curType.visitItemId
				});
				
				if(!RES.Success){
					this.$notice.toast({message: ''+RES.Message+''});
					return;
				}
				var params = {};
				params.title = curType.strName;
				params.VisitId = userInfo.adminId;
				params.userId = this.customerNumer;
				params.visitItemId = curType.visitItemId;
				params.address = RES.Data;
				params.skuArr = this.skuArr;
				params.price = this.price;
				params.costPrice = this.costPrice;
				params.number = this.number;
				params.skuIds = curType.id+'_'+this.skuIds.join('_');
				this.$router.open({
					name: "customerOrderCheckout",
					type: "PUSH",
					params: params
				});
			}
		},
		mounted () {
			this.getProductByDetail();
		},
	}
</script>
@import 'src/js/css/base';
<style scoped lang="scss">
	.box{
		padding: 30px 30px 0;
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
    .selItem{
        padding: 0 20px 20px;
	    border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #bea5a5;
	}
	.selType{
		display: flex;
		flex-direction: row;
    	align-items: center;
	}
	.title{
		width: 600px;
		line-height: 50px;
		font-size: 30px; 
		color: #666;
	}
	.selected{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		white-space: wrap;
	}
	.selText{white-space: wrap;}
	.text{
		width: 160px;
		height:70px; 
		line-height: 70px;
		font-size: 30px; 
		text-align: left;
		color: #666;
	}
	.text-center{
		width: 120px;
		text-align: center;
	}
	.price{
		height:60px; 
		line-height: 60px;
		font-size: 30px; 
	}
	.typeRadio{
		display: flex;
		flex-direction: row;
	}
	.my-input{
		width: 430px; 
		height: 60px; 
		line-height: 60px;
		font-size: 30px; 
        color: #2e2e2e;
        padding: 0 10px;
        background-color: #eee;
        border-radius: 5px;
    }
    .angle-icon {
        margin-left: 16px;
        width: 20px;
        height: 20px;
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
		margin: 50px 0;
	}
	.btnsub{
		width: 600px;
		background-color: #68b8f6;
		border-radius: 150px;
	}
</style>
