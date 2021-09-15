<template>
    <scroller class="scroller">
        <div class="selItem selType" @click="selectType">
            <text class="text">型状：</text>
            <div class="selType">
                <text class="title">{{type[typeIdx].name}}</text>
                <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
            </div>
        </div>
        <div class="selItem">
            <text class="text">尺寸：</text>
            <div class="selType" v-if="!typeIdx">
                <input type="number" value="h1Width" min="1" class="border input"  v-model="h1Width">
                <text>mm X </text>
                <div class="selType" @click="selectHeight(heights1)">
                    <text class="title">{{heights1[hIdx].name}}</text>
                    <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
                </div>
            </div>
            <div v-else>
                <div class="selType">
                    <div class="selType" @click="selectHeight(heights2,true)">
                        <text class="title">{{heights2[hIdx].name}}</text>
                        <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
                    </div>
                    <wxc-button text="自定义尺寸" size="medium" @wxcButtonClicked="customer = !customer" class="btnsub">
                    </wxc-button>
                </div>
                <div class="selType" v-if="customer">
                    <input type="number" value="h2Width" min="1" class="border input" @change="h2WidthChange"  v-model="h2Width">
                    <text>mm X </text>
                    <input type="number" value="h2Height" min="1" class="border input" @change="h2HeightChange"  v-model="h2Height">
                    <text>mm</text>
                </div>
            </div>
        </div>
        <div class="selItem selType">
            <text class="text">数量：</text>
            <input type="number" value="number" min="1" v-model="number" @return="changeNum" class="border input">
            <text>{{type[typeIdx].unit}} </text>
            <text v-if="!type[typeIdx].type" class="tip">整卷分切：按{{rememberNum}}张出货</text>
        </div>
        <div class="selItem">
            <text class="text">材料名称：</text>
            <div class="selType" @click="selectCl">
                <text class="title">{{clName}}</text>
                <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
            </div>
        </div>
        <div class="selItem">
            <text class="text">胶水效果：</text>
            <div class="selType" @click="selectXg">
                <text class="title">{{xiaoguo[xgIdx]}}</text>
                <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
            </div>
        </div>

        <div class="add-input">
            <text class="text">会员号</text>
            <input type="number" v-model="customerNumer" class="my-input" placeholder="请输入会员号">
        </div>

        <div style="height: 100px"></div>
        <div class="fixbot">
            <div class="flex-center">
                <wxc-button text="确定" class="submit" @wxcButtonClicked="submit">
                </wxc-button>
            </div>
        </div>
        
    </scroller>
</template>
<script>
import API from "Utils/api";
const picker = weex.requireModule("picker");
import { WxcButton } from "weex-ui";
export default {
    name: 'id27',
    components: {
        WxcButton
    },
    eros: {
        beforeAppear(params, options ) {
            this.visitItemId = params.visitItemId;
            this.title = params.title;
            this.productId = params.productId
            this.GetCaiLiaoList(params.Qid,params.fid);
        }
    },
    data(){
        return {
            title: '',
            bjRes: [],
            type: [
                {
                    name: '卷装',
                    unit: '卷',
                    type: 1
                },
                {
                    name: '平装',
                    unit: '张',
                    type: 0
                }
            ],
            typeIdx: 0,
            h1Width: 60,
            heights1: [
                {name: '400m',height: 400},
                {name: '500m',height: 500},
                {name: '800m',height: 800},
                {name: '1000m',height: 1000}
            ],
            heights2: [
                {
                    name: 'A4(210mm*297mm)',width: '210',height: '297'
                },
                {
                    name: 'A3(420mm*297mm)',width: '420',height: '297'
                }
            ],
            hIdx: 0,
            number: 1,
            rememberNum: 1,
            customer: false,
            h2Width: 1,
            h2Height: 1,
            cailiao: [],
            clName: '',
            clIdx: 0,
            xiaoguo: [],
            xgIdx: 0,
            params: {},
            customerNumer: ''
        }
    },
    methods: {
        async GetCaiLiaoList(Qid,fid,gid=''){
            let params = {
                Qid: Qid,
                fid: fid,
                gid: gid
            }
            this.params = params;
            const bjRes = await API.YJ_GetCaiLiaoList(params);
            
            if(bjRes.Success){
                this.bjRes = bjRes.Data;
                let juanZh = [];
                let pingZh = [];
                for(var i in bjRes.Data){
                    if(!bjRes.Data[i].CLType){
                        juanZh.push({name: bjRes.Data[i].CLName,JSNames:  bjRes.Data[i].JSNames})
                    }else{
                        pingZh.push({name: bjRes.Data[i].CLName,JSNames:  bjRes.Data[i].JSNames})
                    }
                }
                this.cailiao.push(pingZh);
                this.cailiao.push(juanZh);
                this.clName = this.cailiao[0][0].name;
                this.xiaoguo = bjRes.Data[0].JSNames.split(',');
            }
        },
        //选择类型
        selectType() {
            var items = [];
            if (items.length === 0) {
                this.type.map(item => {
                    items.push(item.name);
                });
            }
            picker.pick(
                {
                    index: this.typeIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.typeIdx = event.data;
                        this.hIdx = 0;
                        this.xgIdx = 0;
                        this.number = 1;
                        this.clName = this.cailiao[event.data][0].name;
                        this.xiaoguo = this.cailiao[event.data][0].JSNames.split(',');
                        if(event.data){
                            this.number = 1000;
                            this.rememberNum = Math.round(400*1000/297);
                            if(1000 > this.rememberNum){
                                let num = Math.ceil(1000/this.rememberNum);
                                this.rememberNum =  this.rememberNum * num;
                            }
                            this.h2Width = this.heights2[0].width;
                            this.h2Height = this.heights2[0].height;
                        }
                    }
                }
            );
        },
        selectHeight(target,isNum){
            var items = [];
            if (items.length === 0) {
                target.map(item => {items.push(item.name)})
            }
            picker.pick(
                {
                    index: this.hIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.hIdx = event.data;
                        if(isNum){
                            this.h2Width = target[event.data].width;
                            this.h2Height = target[event.data].height;
                            let initNum = 0;
                            if(target[event.data].width > target[event.data].height){
                                initNum = Math.round(400*1000/target[event.data].width);
                            }else{
                                initNum = Math.round(400*1000/target[event.data].height);
                            }
                            if(this.number > initNum){
                                let num = Math.ceil(this.number/initNum);
                                this.rememberNum =  initNum * num;
                            }else this.rememberNum = initNum
                            
                        }
                    }
                }
            );
        },
        h2WidthChange(e){
            this.h2Width = e.value;
            if(Number(e.value) > Number(this.h2Height)){
                this.compareSize(e.value)
            }else{
                this.compareSize(this.h2Height)
            }
        },
        h2HeightChange(e){
            this.h2Height = e.value;
            if(Number(e.value) > Number(this.h2Width)){
                this.compareSize(e.value)
            }else{
                this.compareSize(this.h2Width)
            }
        },
        compareSize(tagSize){
            let curCount = Math.round(400*1000/tagSize)
            if(this.number > curCount){
                let num = Math.ceil(this.number/curCount);
                this.rememberNum =  curCount * num;
            }else this.rememberNum = curCount;
        },
        changeNum(e){
            if(e.value > this.rememberNum){
                let num = Math.ceil(e.value/this.rememberNum);
                this.rememberNum =  this.rememberNum * num;
            }else{
                this.rememberNum = this.rememberNum;
            }
        },
        selectCl(){
            var items = [];
            let currentCl = this.cailiao[this.typeIdx];
            if (items.length === 0) {
                currentCl.map(item => {
                    items.push(item.name);
                });
            }
            picker.pick(
                {
                    index: this.clIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.clIdx = event.data;
                        this.xgIdx = 0;
                        this.clName = currentCl[event.data].name;
                        this.xiaoguo = currentCl[event.data].JSNames.split(',');
                    }
                }
            );
        },
        selectXg(){
            var items = this.xiaoguo;
            picker.pick(
                {
                    index: this.xgIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.xgIdx = event.data;
                    }
                }
            );
        },
        async submit(){
            if(this.customerNumer === ''){
                this.$notice.toast({
                    message: '请填写会员号'
                })
                return;
            }
            let userInfo = API.get_userInfo(this);
            let addressRes = await API.YJ_GetUserAddressByUserId({
                Id: userInfo.adminId,
                userId: this.customerNumer,
                VisitItemId: this.visitItemId
            });
            if(!addressRes.Success){
                this.$notice.toast({message: ''+addressRes.Message+''});
                return;
            }
            this.params.uid = userInfo.adminId;
            let CLType = this.type[this.typeIdx].type;
            let xx,yy;
            if(CLType){
                xx = this.h1Width;
                yy = this.heights1[this.hIdx].height*1000;
            }else{
                xx = this.h2Width;
                yy = this.h2Height;
            }
            let frmData = `CLType=${CLType}&xx=${xx}&yy=${yy}&pcount=${this.number}&CLName=${this.clName}&JSName=${this.xiaoguo[this.xgIdx]}`;
            this.params.frmData = frmData;
            const RES = await API.YJ_OpenQuote(this.params);
            this.$notice.toast({message: ''+RES.msg+''})
            let paraStr = [];
            let array = RES.data.paraStr.split(',');
            for(var i in array){
                paraStr.push({
                    name: array[i].split(':')[0],
                    value: array[i].split(':')[1],
                })
            }
            let params = {
                title: this.title,
                VisitId : userInfo.adminId,
				userId : this.customerNumer,
                visitItemId: this.visitItemId,
                skuIds: this.productId+'_0_0_0_0_0_0_0',
                address: addressRes.Data,
                paraStr: paraStr,
                pcount: this.number,
                quoteStr: frmData,
                quoteLogId: RES.data.quoteLogId,
                bjPrice: RES.data.price,
                groupJson: RES.data.GroupJson
            }  
            this.$router.open({
                name: "customerOrderCheckout",
                type: "PUSH",
                params: params
            });
        }
    },
}
</script>
<style lang="less" src='./common.less'></style>