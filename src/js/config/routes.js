// 这里的后缀都是 .js 因为打包出来的都是js文件，而不是.vue文件，我们要告诉客户端跳转那个js

//  这里的路径和dev.json路径的区别
//  pages里面配置的是路由跳转的地址，也就是dev生成的 dist文件夹下的js bundle路径 从dist/js开始
//  dev.json 的 exports 需要打包的js地址，填入src的需要被打包成js bundle的地址   从src开始

export default {
    'main': {
        url: '/pages/yjapp/index.js'
    },
    'login': {
        url: '/pages/yjapp/login.js'
    },
    'logistical-list': {
        title: '物流列表',
        url: '/pages/yjapp/logistical/list.js'
    },
    'logistical-detail': {
        title: '详情页',
        url: '/pages/yjapp/logistical/detail.js'
    },
    'dis-list' : {
        title: '列表',
        url: '/pages/yjapp/logistical/dislist.js'
    },
    'pay' : {
        title: '支付',
        url: '/pages/yjapp/logistical/pay.js'
    },
    'order-list' : {
        title: '平台订单',
        url: '/pages/yjapp/order/list.js'
    },
    'order-detail' : {
        title: '平台订单详情',
        url: '/pages/yjapp/order/detail.js'
    },
    'batch-list' : {
        title: '批量操作列表',
        url: '/pages/yjapp/batch-list/batch-list.js'
    },
    'collection' : {
        title: '财务记录',
        url: '/pages/yjapp/collection/collection.js'
    },
    'collectionlist': {
        title: '财务记录',
        url: '/pages/yjapp/collection/collectionlist.js'
    },
    'person' : {
        title: '修改密码',
        url: '/pages/yjapp/person/person.js',
    },
    'signin': {
        title: '签到',
        url: '/pages/yjapp/signin/sigin.js'
    },
    'signinlist': {
        title: '签到记录',
        url: '/pages/yjapp/signin/siginlist.js'
    },
    'sigindetail': {
        title: '签到详情',
        url: '/pages/yjapp/signin/sigindetail.js'
    },
    '404' : {
        title: '404',
        url: '/pages/yjapp/404.js'
    },
    'map' : {
        title: '地图',
        url: '/pages/yjapp/map/map.js'
    },
    'invoice-list': {
        title: '发货单列表',
        url: '/pages/yjapp/invoice/list.js'
    },
    'invoice-detail': {
        title: '发货单详情',
        url: '/pages/yjapp/invoice/detail.js'
    },
    'echartlist' : {
        title: '业务员配送率',
        url: '/pages/yjapp/echart/list.js'
    },
    'echartdetail': {
        title: '业务员配送率详情',
        url: '/pages/yjapp/echart/detail.js'
    },
    'helpindex': {
        title: '帮助中心',
        url: '/pages/yjapp/help/index.js'
    },
    'apprecord': {
        title: 'APP操作记录查询',
        url: '/pages/yjapp/person/apprecord.js'
    },
    'orderRefund' : {
        title: '发起售后',
        url: '/pages/yjapp/service/orderRefund.js'
    },
    'manualInput': {
        title: '手工输入',
        url: '/pages/yjapp/muff/index.js'
    },
    'areaOrder': {
        title: '区域订单',
        url: '/pages/yjapp/area-order/list.js'
    },
    'areaOrderDetail': {
        title: '区域订单详情',
        url: '/pages/yjapp/area-order/detail.js'
    },
    'performance': {
        title: '业绩统计',
        url: '/pages/yjapp/performance/list.js'
    },
    'performanceDetail': {
        title: '业绩详情',
        url: '/pages/yjapp/performance/detail.js'
    },
    'performanceAdminDetail': {
        title: '业绩详情',
        url: '/pages/yjapp/performance/adminDetail.js'
    },
    'performanceOrderDetail': {
        title: '业绩详情',
        url: '/pages/yjapp/performance/orderDetail.js'
    },
    'performanceGrowth': {
        title: '业绩排行',
        url: '/pages/yjapp/performance-growth/list.js'
    },
    'performanceGrowthDetail': {
        title: '业绩排行详情',
        url: '/pages/yjapp/performance-growth/detail.js'
    },
    'performanceGrowthAdminDetail': {
        title: '业绩排行详情',
        url: '/pages/yjapp/performance-growth/adminDetail.js'
    },
    'performanceGrowthOrderDetail': {
        title: '业绩排行详情',
        url: '/pages/yjapp/performance-growth/orderDetail.js'
    },
    'contactList': {
        title: '联络单',
        url: '/pages/yjapp/contact/list.js'
    },
    'contactDetail': {
        title: '联络单详情',
        url: '/pages/yjapp/contact/detail.js'
    },
    'contactHandle': {
        title: '联络单处理',
        url: '/pages/yjapp/contact/handle.js'
    },
    'contactAdd': {
        title: '联络单新增',
        url: '/pages/yjapp/contact/add.js'
    },
    'routeMap': {
        title: '配送路线',
        url: '/pages/yjapp/map/routeMap.js'
    },
    'visit': {
        title: '客户拜访',
        url: '/pages/yjapp/visit/index.js'
    },
    'visitRecode': {
        title: '拜访记录',
        url: '/pages/yjapp/visit/recode.js'
    },
    'memberAudit': {
        title: '会员审核',
        url: '/pages/yjapp/member-audit/index.js'
    },
    'memberAuditDetail': {
        title: '会员审核详情',
        url: '/pages/yjapp/member-audit/detail.js'
    },
    'deliverGoods': {
        title: '待收货订单列表',
        url: '/pages/yjapp/deliver-goods/list.js'
    },
    'deliverGoodsDetail': {
        title: '待收货订单详情',
        url: '/pages/yjapp/deliver-goods/detail.js'
    },
    'customerOrder': {
        title: '代客下单',
        url: '/pages/yjapp/customer-order/index.js'
    },
    'customerOrderCheckout': {
        title: '确认下单',
        url: '/pages/yjapp/customer-order/checkout.js'
    },
    'searchMember': {
        title: '会员查询',
        url: '/pages/yjapp/search-member/index.js'
    },
    'searchMemberDetail': {
        title: '查询结果',
        url: '/pages/yjapp/search-member/detail.js'
    },
    'regionSummary': {
        title: '区域统计',
        url: '/pages/yjapp/region-summary/list.js'
    },
    'regionSummaryDetail': {
        title: '统计详情',
        url: '/pages/yjapp/region-summary/detail.js'
    },
    'id27': {
        title: '不干胶材料',
        url: '/pages/yjapp/customer-order/components/id27.js'
    },
}
