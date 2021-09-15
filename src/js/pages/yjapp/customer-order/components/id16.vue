<template>
    <scroller class="scroller">
        <div class="selItem">
            <text class="text">尺寸：</text>
            <div class="selType">
                <input type="number" value="width" min="1" class="border input" @change="widthChange"  v-model="width">
                <text>mm X </text>
                <input type="number" value="height" min="1" class="border input" @change="heightChange"  v-model="height">
                <text>mm</text>
            </div>
        </div>
        <div class="selItem">
            <text class="text">印刷颜色：</text>
            
        </div>
        <div class="selItem">
            <text class="text">材料名称：</text>
            <div class="selType" @click="selectCl">
                <text class="title">{{clName}}</text>
                <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="angle-icon"></image>
            </div>
        </div>
        <div class="selItem selType">
            <text class="text">印刷数量：</text>
            <input type="number" value="number" min="1" v-model="number" @return="changeNum" class="border input">
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
            number: 1,
            width: 1,
            height: 1,
            cailiao: [],
            clName: '',
            clIdx: 0,
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
                xx = this.width;
                yy = this.height;
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