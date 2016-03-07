/*
* name:    投顾大赛公用js；
* version: 2.0
* info:    基于jquery
* more:    支持的接口及功能请查看相应的文档，支持模块化调用
* update:  2016-02-25
*/

! function (global, factory) {
  "function" == typeof define && (define.amd || define.cmd) ? define(function () {
    return factory(global)
  }) : factory(global, !0)
}(this, function (global, factory){

  var ua = navigator.userAgent.toLowerCase(), // 浏览器标识
      isAndroid = -1 != ua.indexOf("android"), // 安卓版
      isIos = -1 != ua.indexOf("iphone") || -1 != ua.indexOf("ipad"), // IOS版
      isYiqiniu = -1 != ua.indexOf("yiqiniu"), // 一起牛APP
      host = window.location.protocol + "//" + window.location.host;

      // 需要配置的地方
  var devHost = 'http://192.168.1.19',
      development = true; // 是否开发模式，开发时配置true，上线时为false

  //apis
  var apis = {

    //注册
    register: (development ? devHost : host) + "/g_adviser_api/user_register",

    //登录
    login: (development ? devHost : host) + "/g_adviser_api/user_login",

    //验证码
    captcha: (development ? devHost : host) + "/g_adviser_api/fetch_captcha",

    //参赛
    join: (development ? devHost : host) + "/g_adviser_api/join_event",

    //机构
    organization: (development ? devHost : host) + "/g_adviser_api/fetch_adviser_orgs",

    //上传图片
    image: (development ? devHost : host) + "/common_api/upload_image",

    //提交认证
    verify: (development ? devHost : host) + "/g_adviser_api/upload_adviser_verify",

    //获取投顾认证信息
    adviser: (development ? devHost : host) + "/adviser/fetch_adviser_verify",

    //榜单列表
    joinList: (development ? devHost : host) + "/g_adviser_api/fetch_join_list",

    //个人参赛详情
    joinDetail: (development ? devHost : host) + "/g_adviser_api/fetch_join_detail",

    //投票
    vote: (development ? devHost : host) + "/g_adviser_api/save_vote",

    //订阅组合
    pay: (development ? devHost : host) + "/g_adviser_api/pay_request",

    //精选观点
    noteList: (development ? devHost : host) + "/g_adviser_api/fetch_adviser_note_list",

    //搜索
    searchJoin: (development ? devHost : host) + "/g_adviser_api/search_join",

    //当前赛事详情
    eventDetail: (development ? devHost : host) + "/g_adviser_api/event_detail",

    //持仓详情
    ptfDetail: (development ? devHost : host) + "/g_adviser_api/fetch_simu_ptf_balance_detail",

    //组合委托概要
    ptfOrders: (development ? devHost : host) + "/g_adviser_api/fetch_simu_ptf_today_orders",

    //当日组合委托详情
    ptfOrderDetail: (development ? devHost : host) + "/g_adviser_api/fetch_simu_today_order_detail",

    //调仓预检
    simuCheck: (development ? devHost : host) + "/g_adviser_api/check_simu_adjust_trans",

    //新增股票预检
    simuAddStkCheck: (development ? devHost : host) + "/g_adviser_api/check_simu_add_stks_trans",

    //调仓
    simuOrder: (development ? devHost : host) + "/g_adviser_api/simu_order",

    //撤单预检
    withdrawCheck: (development ? devHost : host) + "/g_adviser_api/check_simu_ptf_withdraw",

    //撤单
    withdrawOrder: (development ? devHost : host) + "/g_adviser_api/simu_ptf_withdraw",

    //获取历史委托概要
    historyOrders: (development ? devHost : host) + "/g_adviser_api/fetch_simu_ptf_his_orders",

    //获取历史委托详情
    historyOrderDetail: (development ? devHost : host) + "/g_adviser_api/fetch_simu_his_order_detail",

    //市场全局搜索
    searchMkt: (development ? devHost : host) + "/mktinfo_api/search_mkt",

    //实时行情
    getQuot: (development ? devHost : host) + "/mktinfo_api/get_quot",

    //获取省、直辖市列表
    province: (development ? devHost : host) + "/g_adviser_api/fetch_province",

    //获取城市列表
    city: (development ? devHost : host) + "/g_adviser_api/fetch_city"
  };

  var links = {
    register: host + (development ? '/html/' : '/webstatic/') + 'fachina/register.html'
  };

  // 抛出对象
  var J_app = {

    /*主机名*/
    host: host,

    /*接口*/
    api: apis,

    // 页面跳转
    link : links,

    /*获取url中的参数*/
    getUrlParam : function(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
          r = window.location.search.substr(1).match(reg);

      if(r != null){
        return unescape(r[2]);
      } else{
        return null;
      }
    },

    /*生成唯一数*/
    onlyNum : function() {
      var num = '',
        timestamp = '',
        randomNum = '';

      timestamp = (new Date()).valueOf();

      for(var r = 0; r < 6; r++) {
        randomNum +=Math.floor(Math.random()*10);
      }
      num = timestamp + randomNum;
      return num;
    },

    /*为空处理*/
    isNull : function(text) {
       if(typeof text === "undefined" || text === null){
         return '';
       }else{
         return text;
       }
    },

    /*AJAX请求封装，data需传递对象*/
    ajax : function(url,data,callback,error){

      var params = {};
      params['params'] = data;

      $.ajax({
        type: "POST",
        url : url,
        data: JSON.stringify(params),
        dataType:"json",
        contentType:"application/json",
        success: callback,
        error: function(){
          if(error){
            error();
          }else{
            console.log("请求失败");
          }
        }
      });
    },

    /*计算时间差，参数为时间戳*/
    timeDifference : function(timestamps) {

      var formatNumber = function(n) {
        if(n < 10) {
          n = '0' + n;
        }
        return n;
      };

      var originalTime = new Date(timestamps),
          currentTime = (new Date()).getTime(),
          interval = currentTime - timestamps,
          days,
          hours,
          minutes,
          seconds,
          timeHtml = '';

      days = Math.floor(interval / (24 * 3600 * 1000)); //相差天数
      hours = Math.floor(interval / (3600 * 1000)); //相差小时数
      minutes = Math.floor(interval / (60 * 1000)); //相差分钟
      seconds = Math.floor(interval / 1000); //相差秒数

      var adjustedYear = originalTime.getFullYear(),
          adjustedMonth = formatNumber((originalTime.getMonth() + 1)),
          adjustedDate = formatNumber(originalTime.getDate()),
          adjustedHours = formatNumber(originalTime.getHours()),
          adjustedMinutes = formatNumber(originalTime.getMinutes()),
          adjustedSeconds = formatNumber(originalTime.getSeconds());

      var nowTime = new Date;

      if(originalTime.getFullYear() == nowTime.getFullYear() && originalTime.getMonth() == nowTime.getMonth() && originalTime.getDate() == nowTime.getDate()) {
        if(seconds < 60) {
          timeHtml = '刚刚';
        } else if (minutes < 60) {
          timeHtml = minutes + '分钟前';
        } else {
          timeHtml = '今天&nbsp;' +
                  adjustedHours + ':' +
                  adjustedMinutes;
        }
      } else if(originalTime.getFullYear() == nowTime.getFullYear() && originalTime.getMonth() == nowTime.getMonth() && originalTime.getDate() == (nowTime.getDate() - 1)) {
        timeHtml = '昨天&nbsp;' +
                adjustedHours + ':' +
                adjustedMinutes;
      } else {
        var yearHtml = '';

        if(adjustedYear != (new Date()).getFullYear()) {
          yearHtml = adjustedYear + '年'
        }

        timeHtml += yearHtml +
                  adjustedMonth + '月' +
                  adjustedDate + '日&nbsp;' +
                  adjustedHours + ':' +
                  adjustedMinutes;
      }
      return timeHtml;
    },

    /*微信分享封装，doption为传入对象，分享地址，图片地址需为绝对地址*/
    shareByWeixin : function(doption) {

      var ua = navigator.userAgent.toLowerCase();

      if(ua.indexOf('micromessenger') > -1){

        var options = {};

        /*获取签名*/
        $.ajax({
          type : "post",
          async : false, /*同步执行*/
          url : window.location.protocol + "//" + window.location.host + "/web/getWxSignature",
          dataType : "json",
          data : {
            "url" : window.location.href
          },
          success : function(data) {

            options = {
              debug: false,
              appId: 'wx06d05f7e4f8d0fdc',
              timestamp: data.timestamp,
              nonceStr: data.nonceStr,
              signature: data.signature,
              jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo'],
              title:doption.title,
              desc:doption.desc,
              link:doption.link,
              imgUrl:doption.imgUrl
            };
            /*调用微信分享方法*/
            niuWebShare(options);
          },
          error : function(errorMsg) {
            return ;
          }
        });

        /*微信分享样式自定义方法*/
        function niuWebShare (options) {

          var options = options;

          if(!options){
            console.log("error:没有正确配置参数！");
            return true;
          }

          wx.config({
            debug: options.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: options.appId, // 必填，公众号的唯一标识
            timestamp: options.timestamp, // 必填，生成签名的时间戳
            nonceStr: options.nonceStr, // 必填，生成签名的随机串
            signature: options.signature,// 必填，签名，见附录1
            jsApiList: options.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });

          wx.ready(function(){
            /*---分享给朋友---*/
            wx.onMenuShareAppMessage({
              title: options.title, // 分享标题
              desc: options.desc, // 分享描述
              link: options.link, // 分享链接
              imgUrl: options.imgUrl, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                console.log("----朋友分享成功的------");
              },
              cancel: function () {
                console.log("----朋友点击了取消------");
              }
            });

            /*---分享到朋友圈---*/
            wx.onMenuShareTimeline({
              title: options.title,
              link: options.link,
              imgUrl: options.imgUrl,
              success: function () {
                console.log("----朋友圈分享成功的------");
              },
              cancel: function () {
                console.log("----朋友圈点击了取消------");
              }
            });

            /*---分享到QQ---*/
            wx.onMenuShareQQ({
              title: options.title,
              desc: options.desc,
              link: options.link,
              imgUrl: options.imgUrl,
              success: function () {
                console.log("----qq分享成功的------");
              },
              cancel: function () {
                console.log("----qq点击了取消------");
              }
            });
          });
        };
      }
    },

    //提示类弹窗
    alert : function(text, time) {

      if(typeof time === 'undefined' || typeof time !== 'number'){
        time = 2000;
      }

      var _html = [];

      _html.push('<div class="ui-alert">');
      _html.push('<div class="ui-alert-main">' + text + '</div>');
      _html.push('</div>');

      $('body').append(_html.join(''));
      $(".ui-alert").fadeIn();

      setTimeout(function() {
        $('.ui-alert').remove();
      },time);
    },

    //在一起牛APP打开
    notAtYiqiniu: function() {

      var _html = [];

      _html.push('<div class="niu-at-yiqiniu">');
      _html.push('<div class="niu-at-yiqiniu-img">');
      _html.push('<img src="'+ J_app.host + '/static/common/images/logo120.png" alt="">');
      _html.push('</div>');
      _html.push('<div class="niu-at-yiqiniu-text">请在一起牛客户端打开链接！</div>');
      _html.push('</div>');

      $('body').empty().append(_html.join(''));
      $('title').text('抱歉，出错了');
    },

    //加载失败
    loadFail: function() {

      var _html = [];

      _html.push('<div class="niu-load-fail">');
      _html.push('<div class="niu-load-fail-img">');
      _html.push('<img src="' + J_app.host + '/static/common/images/icon_fail.png" alt="">');
      _html.push('</div>');
      _html.push('<div class="niu-load-fail-text">抱歉，出错啦！</div>');
      _html.push('</div>');

      $('body').empty().append(_html.join(''));
      $('title').text('请求错误');
    },

    // 判断是否登录公用方法
    checkSign: function(callback) {

      if(!$.cookie("fachinaId")){
        window.location.href = J_app.link.register;
      } else{
        callback();
      }
    }
  };

  // Jquery扩展方法
  (function($){
    /*
     * muSlideUp：向上定时无缝滚动动画
     * @option.time: 滚动间隔时间
     * @option.speed: 滚动速度
     * 使用方法：$('#demo').muSlideUp({time:5000,speed: 500})
     */
    $.fn.muSlideUp = function(option) {

      var scrollWrap = $(this),
          childHeight = scrollWrap.height(),
          timer;

      //默认参数
      option=$.extend({
        "time":3000,
        "speed":1000
      }, option);

      //向上滑动动画
      function slideUpAnimate(){
        scrollWrap.children().first().animate(
          {marginTop: -childHeight},
          option.speed,
          function(){
            $(this).css("margin-top", 0).appendTo(scrollWrap);
        })
      }

      //自动间隔时间向上滑动
      timer = setInterval(slideUpAnimate, option.time);

      //悬停时停止滑动，离开时继续执行
      scrollWrap.children().hover(function(){
        clearInterval(timer);
      },function(){
        timer = setInterval(slideUpAnimate,option.time);  //继续执行动画
      })
    };

    /*muTabs: tab切换*/
    $.fn.muTabs = function(view, callback) {

      var tabWrap = $(this),
          tabs = tabWrap.children(),
          views = $(view).children();

      $.each(tabs, function(index,val){
        $(val).on('click', function(){
          tabs.removeClass('active');
          $(this).addClass('active');
          views.removeClass('show');
          views.eq(index).addClass('show');

          if(typeof callback === 'function'){
            callback($(this));
          }
        })
      });
    };
  })(jQuery);

  // 使用rem初始化页面,自执行
  (function(){
    var page = this;
    var html = document.getElementsByTagName("html")[0];
    page.width = 320;
    page.fontSize = 100;
    page.widthProportion = function(){
       var p = (html.offsetWidth)/page.width;
       return p>2?2:p<1?1:p;
    };
    page.changePage = function(){
        html.setAttribute("style","font-size:" + page.widthProportion() * page.fontSize + "px !important");
    };
    page.changePage();
    window.addEventListener("resize",function(){page.changePage();},false);
  })();

  // 全局按钮触摸事件
  (function($){
    $(document).on('touchstart', '.J-touch', function() {
      $(this).addClass('active');
    }).on('touchend', '.J-touch', function() {
      $(this).removeClass('active');
    });
  })(jQuery);

  //头部固定栏跳转*/
  (function($) {
    // back
    $("#fixed-header-back").click(function() {
      window.history.back();
    });
    // 回到首页
    $("#fixed-header-home").click(function() {
      window.location.href = "index.html";
    });
  })(jQuery);

  //抛出对象
  factory && (global.J_app = J_app);
});