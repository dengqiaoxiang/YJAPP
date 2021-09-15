<template>
    <list ref="scrollerList">
        <cell>
            <scroller>
                <wxc-cell 
                    label="发件人"
                    :title="listItem.Sender"
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="发布时间"
                    :title="listItem.SendDateStr"
                    @wxcCellClicked="getParams">
                </wxc-cell>
				<div class="content" >
					<text class="text">问题内容</text>
                    <div class="textarea">
                        <text>{{listItem.LiaisonContent}}</text>
                    </div>
				</div>
                <wxc-cell 
                    label="类型"
                    :title="listItem.SendType"
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="收件部门"
                    :title="listItem.DepartName  "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="处理人"
                    :title="listItem.Handler "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell label="处理进度"
                        :title="listItem.HandlerSchedule "
                        @wxcCellClicked="getParams">
                </wxc-cell>
                <template v-if="isHandle">
                    <wxc-cell 
                        label="处理时间"
                        :title="listItem.HandlerDateStr"
                        @wxcCellClicked="getParams">
                    </wxc-cell>
                    <div class="content" >
                        <text class="text">处理结果</text>
                        <div class="textarea"><text>{{listItem.HandlerResult}}</text></div>
                    </div>
                </template>

                <div class="top-three-top"></div>
                <div class="bottom-btn" v-if="!isHandle">
                    <wxc-button text="立即处理" type="red" v-if="listItem.Candeal"
                        @wxcButtonClicked="handle" class="one"></wxc-button>
                    <template v-if="changer && !listItem.Candeal">
                        <wxc-button text="指定"
                            type="yellow" class="two"
                            @wxcButtonClicked="appoint" ></wxc-button>
                        <wxc-button text="转发"
                            type="blue" class="two"
                            @wxcButtonClicked="transmit"></wxc-button>
                    </template>
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
            tapBackTime: 0,
            navShow: true,
            statusBarStyle: 'LightContent',
            listItem: {},
            testData: [],
            isHandle: false, //是否处理
            changer: false, //是否是负责人或总经理
            departmentIdx:  -1,
            departments: [],
            subordinateIdx:  -1,
            subordinates: []
        }
    },
    eros: {
        beforeAppear(params, options ) {
            this.listItem = params;
            if(params.HandlerSchedule !== '未处理'){
                this.isHandle = true
            }
            if(params.Permisson !== '普通员工'){
                this.changer = true;
            }
        }
    },
    methods: {
        async handle () {
            this.$router.open({
                name: 'contactHandle',
                type: 'PUSH',
                params: {
                    id: this.listItem.Id,
                    ctn: this.listItem.LiaisonContent
                }
            })
        },
        //获取部门
        async getDepartment(){
            var RES = await API.KIY_DEPARTMENTLIST({});
            if(RES.Success){
                this.departments = RES.Data;
            }
        },
        //选择部门
        transmit(){
              var items = [];
            if (items.length === 0) {
                this.departments.map(item => {
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
                        this.transmitDepartment();
                    }
                }
            );
        },
        async transmitDepartment(){
            this.$notice.loading.show("正在转发");
            var transmitRes = await API.KIY_DepartmentTransmit({
                Id: this.listItem.Id,
                Depart: this.departments[this.departmentIdx].Id
            });
            this.$notice.loading.hide();
            if(transmitRes.Success){
                this.$router.setBackParams({isRefresh: true})
                this.$router.back()
            }else{
                this.$notice.alert({
                    title: '温馨提示',
                    message: ''+transmitRes.Message+'',
                    okTitle: '确认'
                })
            }
        },
        //获取下属
        async getAppointUser(){
            var RES = await API.KIY_GetAppointUser({
                Id: this.listItem.Id
            });
            if(RES.Success){
                this.subordinates = RES.Data;
            }
        },
        appoint(){
            var items = [];
            if (items.length === 0) {
                this.subordinates.map(item => {
                    items.push(item.UserName);
                });
            }
            picker.pick(
                {
                    index: this.subordinateIdx,
                    items
                },
                event => {
                    if (event.result === "success") {
                        this.subordinateIdx = event.data;
                        this.appointUser();
                    }
                }
            );
        },
        async appointUser(){
            this.$notice.loading.show("正在指派");
            var transmitRes = await API.KIY_AppointUser({
                Id: this.listItem.Id,
                AppointUserId: this.subordinates[this.subordinateIdx].Id
            });
            this.$notice.loading.hide();
            if(transmitRes.Success){
                this.$router.setBackParams({isRefresh: true})
                this.$router.back()
            }else{
                this.$notice.alert({
                    title: '温馨提示',
                    message: ''+transmitRes.Message+'',
                    okTitle: '确认'
                })
            }
        },
    },
    mounted() {
        this.getDepartment();
        this.getAppointUser();
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
</style>

