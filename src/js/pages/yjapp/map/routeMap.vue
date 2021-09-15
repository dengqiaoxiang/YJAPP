<template>
    <div class="container">
      <web ref="webview" style="width: 730px; height: 750px" @pagefinish="onPageFinish" @message="bindmessage" src="https://www.kiy.cn//m-mobile/autobaojia/index?pid=16&title=%E5%BD%A9%E8%89%B2%E4%B8%93%E7%89%88%E4%B8%8D%E5%B9%B2%E8%83%B6&isDetail=true&ProductId=119&fid=&detailCommon=false&data=">
      </web>
    </div>
    
</template>
<script>
  export default {
    data(){
      return {
        browser: ''
      }
    },
    methods: {
      bindmessage (e) {
        console.log(e);
      },
      onPageFinish: function(e) {
        // this.$notice.alert({
        //   message: ''+JSON.stringify(e)+''
        // })
      },
      getBrowser() {

            var userAgent = navigator.userAgent;
            var version = navigator.appVersion;
            var language = (navigator.browserLanguage || navigator.language).toLowerCase();

            // 浏览器信息
            var browser = {
                trident: userAgent.indexOf("Trident") > -1,
                presto: userAgent.indexOf("Presto") > -1,
                webKit: userAgent.indexOf("AppleWebKit") > -1,
                gecko: userAgent.indexOf("Gecko") > -1 && userAgent.indexOf("KHTML") == -1,
                mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/),
                ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1,
                iPhone: userAgent.indexOf("iPhone") > -1,
                iPad: userAgent.indexOf("iPad") > -1,
                webApp: userAgent.indexOf("Safari") == -1,
                language: language,
                version: version
            };

            return browser;
      }
    },
    mounted(){
      this.$notice.alert({
        message: ''+navigator+''
      })
    }
  }
</script>
<style lang="">
</style>