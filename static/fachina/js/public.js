/*
 * name:    投顾大赛公用js；
 * version: 2.0
 * info:    基于jquery
 * more:    支持的接口及功能请查看相应的文档，支持模块化调用
 * update:  2016-02-25
 */

!function(global, factory) {
  'function' == typeof define && (define.amd || define.cmd) ? define(function() {
    return factory(global)
  }) : factory(global, !0)
}(this, function(global, factory) {

  var ua = navigator.userAgent.toLowerCase(), // 浏览器标识
    isAndroid = -1 != ua.indexOf('android'), // 安卓版
    isIos = -1 != ua.indexOf('iphone') || -1 != ua.indexOf('ipad'), // IOS版
    isYiqiniu = -1 != ua.indexOf('yiqiniu'), // 一起牛APP
    isWeixin = -1 != ua.indexOf('micromessenger'), // 微信APP
    host = window.location.protocol + '//' + window.location.host;

  //需要配置的地方
  var devHost = 'http://192.168.1.19',
    development = false; // 是否开发模式，开发时配置true，上线时为false

  //apis
  var apis = {

    //注册
    register: (development ? devHost : host) + '/g_adviser_api/user_register',

    //登录
    login: (development ? devHost : host) + '/g_adviser_api/user_login',

    //验证码
    captcha: (development ? devHost : host) + '/g_adviser_api/fetch_captcha',

    //参赛
    join: (development ? devHost : host) + '/g_adviser_api/join_event',

    //机构
    organization: (development ? devHost : host) + '/g_adviser_api/fetch_adviser_orgs',

    //获取省、直辖市列表
    province: (development ? devHost : host) + '/g_adviser_api/fetch_province',

    //获取城市列表
    city: (development ? devHost : host) + '/g_adviser_api/fetch_city',

    //上传图片
    image: (development ? devHost : host) + '/common_api/upload_image',

    //提交认证
    verify: (development ? devHost : host) + '/g_adviser_api/upload_adviser_verify',

    //获取投顾认证信息
    adviser: (development ? devHost : host) + '/adviser/fetch_adviser_verify',

    //榜单列表
    joinList: (development ? devHost : host) + '/g_adviser_api/fetch_join_list',

    //个人参赛详情
    joinDetail: (development ? devHost : host) + '/g_adviser_api/fetch_join_detail',

    //投票
    vote: (development ? devHost : host) + '/g_adviser_api/save_vote',

    //订阅组合
    pay: (development ? devHost : host) + '/g_adviser_api/pay_request',

    //精选观点
    noteList: (development ? devHost : host) + '/g_adviser_api/fetch_adviser_note_list',

    //搜索
    searchJoin: (development ? devHost : host) + '/g_adviser_api/search_join',

    //当前赛事详情
    eventDetail: (development ? devHost : host) + '/g_adviser_api/event_detail',

    //关注
    fav: (development ? devHost : host) + '/g_adviser_api/ptf_fav',

    //持仓详情
    ptfDetail: (development ? devHost : host) + '/g_adviser_api/fetch_simu_ptf_balance_detail',

    //当日委托
    todayOrders: (development ? devHost : host) + '/g_adviser_api/fetch_simu_ptf_today_orders',

    //调仓
    simuOrder: (development ? devHost : host) + '/g_adviser_api/simu_order',

    //撤单
    withdrawOrder: (development ? devHost : host) + '/g_adviser_api/simu_ptf_withdraw',

    //历史委托
    historyOrders: (development ? devHost : host) + '/g_adviser_api/fetch_simu_his_order_detail',

    //市场全局搜索
    searchMkt: (development ? devHost : host) + '/g_adviser_api/search_mkt',

    //个股五档行情
    fiveBets: (development ? devHost : host) + '/g_adviser_api/get_five_bets',

    //获取微信签名
    fetchJssdk: (development ? devHost : host) + '/gs_api/fetch_js_sdk_signature',

    //广告
    advert: (development ? devHost : host) + '/ad_api/fetch_ad_link_list_noapp'
  };

  //链接
  var links = {
    register: host + (development ? '/html/' : '/webstatic/') + 'fachina/register.html',
    index : host + (development ? '/html/' : '/webstatic/') + 'fachina/index.html',
    home : host + (development ? '/html/' : '/webstatic/') + 'fachina/home.html',
    trade : host + (development ? '/html/' : '/webstatic/') + 'fachina/trade.html',
    rank: host + (development ? '/html/' : '/webstatic/') + 'fachina/rank.html',
    weixin : host + '/gs_api/oauth2API?redirectType=game_adviser_entry_type&src='
  };

  //浏览器agent
  var uAgent = {
    android : isAndroid,
    ios : isIos,
    yiqiniu : isYiqiniu,
    weixin : isWeixin
  };

  //cookie配置
  var cookieText = {
    id : 'fachinaId',
    status: 'fachinaStatus',
    type: 'fachinaType'
  };

  //全局对象
  var J_app = {

    // 域名
    host: host,

    // 接口
    api: apis,

    //页面跳转
    link: links,

    // 浏览器标识
    agent : uAgent,

    // 验证手机号
    validPhone: function(phone) {
      return /^\d{11}$/.test(phone);
    },

    // 验证密码
    validPw: function(pwd) {
      return /^\S{6,16}$/.test(pwd);
    },

    // 验证验证码
    validCaptcha: function(captcha) {
      return /^\S{1,10}$/.test(captcha);
    },

    // 获取url中的参数
    getUrlParam: function(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
          r = window.location.search.substr(1).match(reg);

      if (r != null) {
        return decodeURIComponent(r[2]);
      } else {
        return null;
      }
    },

    // 生成唯一数
    onlyNum: function() {
      var num = '',
          timestamp = '',
          randomNum = '';

      timestamp = (new Date()).valueOf();

      for (var r = 0; r < 6; r++) {
        randomNum += Math.floor(Math.random() * 10);
      }
      num = timestamp + randomNum;
      return num;
    },

    // 货币格式化
    formatCurrency: function(v) {
      if(isNaN(v)){
          return v;
      }
      v = (Math.round((v - 0) * 100)) / 100;
      v = (v == Math.floor(v)) ? v + '.00' : ((v * 10 == Math.floor(v * 10)) ? v
              + '0' : v);
      v = String(v);
      var ps = v.split('.');
      var whole = ps[0];
      var sub = ps[1] ? '.' + ps[1] : '.00';
      var r = /(\d+)(\d{3})/;
      while (r.test(whole)) {
          whole = whole.replace(r, '$1' + ',' + '$2');
      }
      v = whole + sub;
      return v;
    },

    // 百分比格式化
    formatPer: function(num,noSymbol) {
      var data = '';
      if(num){
        data = (num * 100).toFixed(2);
      } else{
        data = '0.00';
      }
      return noSymbol ? data : (data + '%');
    },

    // 空数据格式化
    isNull: function(text) {
      if (typeof text === 'undefined' || text === null) {
        return '';
      } else {
        return text;
      }
    },

    // 收益率颜色
    yieldColor: function(yield) {
      if(typeof yield !== 'number'){
        yield = parseFloat(yield);
      }

      if(yield > 0){
        return 'text-red';
      } else if(yield < 0){
        return 'text-green';
      } else {
        return '';
      }
    },

    // AJAX请求封装
    // @data: 需传递参数对象
    ajax: function(url, data, callback, error) {

      var params = {};
      params['id'] = J_app.onlyNum();
      params['src'] = 'GA';
      params['cId'] = J_app.getCookie('id');
      params['uAgent'] = isWeixin ? 'WX' : (isYiqiniu ? 'QN' : 'O');
      params['params'] = data;

      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: 'application/json',
        success: callback,
        error: function() {
          if (error) {
            error();
          } else {
            console.log("请求超时");
          }
        }
      });
    },

    // AJAX请求封装2
    // @data:需传递对象,没有封装params
    ajaxa: function(url, data, callback, error) {

      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: callback,
        error: function() {
          if (error) {
            error();
          } else {
            console.log('请求超时');
          }
        }
      });
    },

    // 计算当前时间差
    // @timestamps: 时间戳
    timeDifference: function(timestamps) {
      var formatNumber = function(n) {
        if (n < 10) {
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

      if (originalTime.getFullYear() == nowTime.getFullYear() && originalTime.getMonth() == nowTime.getMonth() && originalTime.getDate() == nowTime.getDate()) {
        if (seconds < 60) {
          timeHtml = '刚刚';
        } else if (minutes < 60) {
          timeHtml = minutes + '分钟前';
        } else {
          timeHtml = '今天&nbsp;' +
          adjustedHours + ':' +
          adjustedMinutes;
        }
      } else if (originalTime.getFullYear() == nowTime.getFullYear() && originalTime.getMonth() == nowTime.getMonth() && originalTime.getDate() == (nowTime.getDate() - 1)) {
        timeHtml = '昨天&nbsp;' +
        adjustedHours + ':' +
        adjustedMinutes;
      } else {
        var yearHtml = '';

        if (adjustedYear != (new Date()).getFullYear()) {
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

    // 将用户状态带入模板参数
    tmpData: function(data) {
      if(typeof data !== 'object'){
        data = {};
      }
      return $.extend({userStatus: J_app.getCookie('id')}, data);
    },

    // 提示弹窗
    alert: function(text, time) {

      if (typeof time === 'undefined' || typeof time !== 'number') {
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
      }, time);
    },

    // 互动弹窗
    confirm: function(opt) {

      var option = {
        title: '标题',
        main: '',
        sure: function() {
          console.log('你执行了确认操作！');
        },
        cancel: function() {
          $(this).closest('.ui-dialog').remove();
        },
        sureBtnText: '确定',
        cancelBtnText: '取消'
      };

      $.extend(option, opt);

      var _html = [];

      _html.push('<div class="ui-dialog"><div class="dialog-box">');
      _html.push('<div class="dialog-title">' + option.title + '</div>');
      _html.push('<div class="dialog-main">' + option.main + '</div>');
      _html.push('<div class="dialog-action ui-row">');
      _html.push('<div class="ui-col col-2"><button class="btn btn-gray btn-fixed-dialog J-dialog-cancel">' + option.cancelBtnText + '</button></div>');
      _html.push('<div class="ui-col col-2"><button class="btn btn-red btn-fixed-dialog J-dialog-sure">' + option.sureBtnText + '</button></div>');
      _html.push('</div></div>');

      $('body').append(_html.join(''));

      $('.J-dialog-cancel').unbind('click');
      $('.J-dialog-sure').unbind('click');

      $('.J-dialog-cancel').on('click', option.cancel);
      $('.J-dialog-sure').on('click', function() {
        option.sure();
        $(this).closest('.ui-dialog').remove();
      });
    },

    // 存储cookie
    setCookie: function(name, val) {
      if(cookieText[name]){
        $.cookie(cookieText[name], val, {expires:365,path:'/'});
      }
    },

    // 取值cookie
    getCookie: function(name) {
      if(cookieText[name]){
        return $.cookie(cookieText[name]);
      }
      else{
        return '';
      }
    },

    // loading
    loading: function(type) {
      if (type) {
        $('body').append('<div class="ui-loading"><div class="loader"></div></div>');
      } else {
        $('.ui-loading').remove();
      }
    },

    // 生成二维码
    urlToImg: function(box, url) {
      var $box = $(box);
      $box.qrcode({
        correctLevel: 0,
        text: url
      });
      $box.find('canvas').css({'width':'2rem', 'heigit':'2rem'});
    },

    // 微信分享
    shareByWeixin: function(b, t, d, l, i) {

      var pageUrl = window.location.href;
      var title = t;
      var desc = d;
      var link = l;
      var imgUrl = i;
      var options = {};

      var params = {
        url: pageUrl,
        src: 'GA'
      };
      /*获取签名*/
      J_app.ajaxa(apis.fetchJssdk, params, function(data) {
        options = {
          debug: false,
          appId: data.result.appId,
          timestamp: data.result.timestamp,
          nonceStr: data.result.noncestr,
          signature: data.result.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],
          title: title,
          desc: desc,
          link: link,
          imgUrl: imgUrl
        };
        /*调用微信分享方法*/
        niuWebShare(options);
      }, J_app.ajaxFail, {});

      /*微信分享样式自定义方法*/
      function niuWebShare(options) {

        var options = options;

        if (!options) {
          console.log("error:没有正确配置参数！");
          return true;
        }

        wx.config({
          debug: options.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: options.appId, // 必填，公众号的唯一标识
          timestamp: options.timestamp, // 必填，生成签名的时间戳
          nonceStr: options.nonceStr, // 必填，生成签名的随机串
          signature: options.signature, // 必填，签名，见附录1
          jsApiList: options.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function() {

          //关闭分享按钮
          if (b) {
            wx.hideOptionMenu();
          } else {
            wx.showOptionMenu();
          }

          /*---分享给朋友---*/
          wx.onMenuShareAppMessage({
            title: options.title, // 分享标题
            desc: options.desc, // 分享描述
            link: options.link, // 分享链接
            imgUrl: options.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
              console.log("----朋友分享成功的------");
            },
            cancel: function() {
              console.log("----朋友点击了取消------");
            }
          });

          /*---分享到朋友圈---*/
          wx.onMenuShareTimeline({
            title: options.title,
            link: options.link,
            imgUrl: options.imgUrl,
            success: function() {
              console.log("----朋友圈分享成功的------");
            },
            cancel: function() {
              console.log("----朋友圈点击了取消------");
            }
          });

          /*---分享到QQ---*/
          wx.onMenuShareQQ({
            title: options.title,
            desc: options.desc,
            link: options.link,
            imgUrl: options.imgUrl,
            success: function() {
              console.log("----qq分享成功的------");
            },
            cancel: function() {
              console.log("----qq点击了取消------");
            }
          });
        });
      };
    },

    // 投票
    voteAction: function() {
      $(document).on('click', '.J-vote', function() {
        var $this = $(this);

        J_app.checkSign(function() {
          var numberBox = $this.parent().find('.total-number'),
              number = parseInt(numberBox.html()),
              params = {};

          if($this.hasClass('J-locked')) {
            return;
          }
          $this.addClass('J-locked');
          J_app.loading(true);

          params['joinId'] = $this.data('id');
          J_app.ajax(J_app.api.vote, params, function(data) {

            $this.removeClass('J-locked');
            J_app.loading(false);

            if (data.code === 0) {

              // 如果用户没关注微信，弹出二维码
              if(isWeixin){
                if(data.result.subscribe === 0){
                  $('body').append(template('common/qszg'));
                  $('.dialog-master').on('click', function(){
                    $(this).closest('.dialog').remove();
                  });
                }else{
                  J_app.alert('投票成功');
                }
              } else {
                J_app.alert('投票成功');
              }

              numberBox.html(++number);
              if(data.result.voteCount === 0){
                $('.J-vote').removeClass('btn-red J-vote').addClass('btn-orange J-invite').html('帮TA拉票');
              } else{
                $this.html('再投1票');
              }
            } else {
              J_app.alert(data.message);
            }
          }, function() {
            J_app.loading(false);
            J_app.alert('请求超时！');
            $this.removeClass('J-locked');
          });
        });
      });
    },

    // 拉票
    inviteAction: function(option) {
      if(isWeixin){
        $('.dialog').remove();
        $('body').append(template('common/wxShare'));
        $('.dialog').fadeIn();
        $('.dialog').on('click',function(){
          $(this).remove();
        });

        J_app.shareByWeixin(false, option.title, option.desc, option.url, option.img);
      } else if(isYiqiniu){
        jYiqiniu.share(option);
      } else{
        $('.dialog').remove();
        $('body').append(template('common/copyUrl'));
        J_app.urlToImg('#copyUrl', option.url);
        $('.dialog').fadeIn();
        $('.dialog-master').on('click', function(){
          $(this).closest('.dialog').remove();
        });
      }
    },

    // 榜单中的帮TA拉票
    inviteInTable: function() {
      $(document).on('click', '.J-invite', function() {
        var $this = $(this),
            option = {};

        option['url'] = J_app.host + '/webstatic/fachina/ranking.html?joinId=' + $this.data('id');
        option['title'] = $this.closest('tr').find('dt').html() + '邀你参加投顾大赛';
        option['desc'] = '我参加了投顾大赛，快来帮我投票吧！';
        option['img'] = $this.closest('tr').find('img').attr('src');

        J_app.inviteAction(option);
      });
    },

    // 机构拉票
    inviteOrg: function(box) {
      $(box).on('click', 'tr', function(){
        var orgName = $(this).data('org');
        orgName = orgName ? orgName : '证券';
        window.location.href = encodeURI("./search.html?keyword=" + orgName);
      });
    },

    // 关注
    favAction: function() {
      $(document).on('click', '.J-fav', function(){
        var $this = $(this);

        J_app.checkSign(function() {
          var params = {};

          if ($this.hasClass('J-locked')) {
            return;
          }
          $this.addClass('J-locked');
          J_app.loading(true);

          params['joinId'] = $this.data('id');
          J_app.ajax(J_app.api.fav, params, function(data) {
            $this.removeClass('J-locked');
            J_app.loading(false);

            if (data.code === 0) {
              J_app.alert('关注成功');
              $this.removeClass('btn-red J-fav').addClass('btn-gray disabled').html('已关注');
            } else {
              J_app.alert(data.message);
            }
          }, function() {
            $this.removeClass('J-locked');
            J_app.loading(false);
          });
        });
      });
    },

    // 搜索
    search: function() {
      $('#globalSearch').on('click', function() {
        // 获取搜索关键字
        var keyword = $('#searchKeyword').val();
        if (keyword) {
          window.location.href = encodeURI('./search.html?keyword=' + keyword);
        } else {
          J_app.alert('请输入投顾/机构查询！');
        }
      });
    },

    // 广告
    // @position: 广告位;首页：2201，榜单页：2202
    adverst: function(position) {

      // 滑动切换效果
      function addSwiping() {
        var options = {
            loop: true,
            pagination: '#adCtrls',
            nextButton: '#btn_next',
            prevButton: '#btn_prev',
            paginationClickable: false,
            spaceBetween: 0,
            centeredSlides: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false
          },
          adSwiper = new Swiper('#adDiscover', options);
      }

      var params = {};
      params['positionGroup'] = position;
      params['count'] = 5;

      J_app.ajaxa(J_app.api.advert, params, function(data) {
        if (data.code === 0) {
          if (data.result) {
            $('#adImages').empty().append(template('common/adverst', data));

            if (data.result.length > 1) {
              addSwiping();
            }
            setTimeout(function() {
              $('#adCtrls').fadeIn(1000);
            }, 500);
          }
        } else {
          console.log(data.message);
        }
      });
    },

    // 判断用户是否登录
    checkSign: function(callback,tar) {
      if (!J_app.getCookie('id')) {
        if(isWeixin){
          var src = '';
          if(tar){
            src = tar;
          } else{
            src = window.location.href.match(/\/\w+.html/)[0].slice(1,-5);
          }
          window.location.href = links.weixin + src;
        } else if(isYiqiniu){
          window.location.href = './index.html';
        } else {
          window.location.href = links.register;
        }
      } else {
        callback();
      }
    },

    // 用户登录状态
    loginStatus: function() {
      var status = J_app.getCookie('status'),
          className = 'status-' + (status ? status : '1');
      $('#userStatus').addClass(className);
    },

    // 必须登录才能访问的页面
    mustSign: function(callback) {
      if(!J_app.getCookie('id')){
        window.location.href = './index.html';
      } else {
        if(!J_app.getCookie('status') || !J_app.getCookie('type')){
          // 重新请求用户数据并存在cookie
          J_app.userInfo();
        } else{
          callback();
        }
      }
    },

    // 获取用户信息
    userInfo: function(session) {
      var params = {};

      if(session){
        params['sessionId'] = session;
      }

      J_app.ajax(J_app.api.joinDetail, params, function(data){
        if(data.code === 0){
          J_app.saveCookie(data);
          J_app.loginStatus();
        } else {
          J_app.alert(data.message);
        }
      });
    },

    // 保存cookie
    saveCookie: function(data) {

      var id = data.result.cId,
          status = data.result.joinStatus,
          type = data.result.adviserStatus;

      // 存储用户cId
      if(id){
        J_app.setCookie('id', id);
      }

      // 存储用户类型
      if(type || type === 0){
        J_app.setCookie('type', type);
      }

      // 储存状态
      if(type === 1){
        if(status === 2){
          J_app.setCookie('status', 5);
        }
        else {
          J_app.setCookie('status', 2);
        }
      }
      // 投顾
      else if(type === 2){
        if(status === 1){
          J_app.setCookie('status', 3);
        } else if(status === 2) {
          J_app.setCookie('status', 4);
        } else {
          J_app.setCookie('status', 2);
        }
      }
      else {
        J_app.setCookie('status', 2);
      }

      $('body').append(template('common/hidden', data));
    },

    // 导航控制
    navControl: function(link,tar) {

      var target = tar;

      if(!link){
        return;
      }
      if(!tar) {
        target = 'index';
      }

      J_app.checkSign(function(){
        window.location.href = link;
      }, target);
    }
  };

  // Jquery扩展方法
  (function($) {
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
      option = $.extend({
        'time': 3000,
        'speed': 1000
      }, option);

      //向上滑动动画
      function slideUpAnimate() {
        scrollWrap.children().first().animate(
          {marginTop: -childHeight},
          option.speed,
          function() {
            $(this).css('margin-top', 0).appendTo(scrollWrap);
          })
      }

      //自动间隔时间向上滑动
      if(scrollWrap.children().length > 1){
        timer = setInterval(slideUpAnimate, option.time);
      }

      //悬停时停止滑动，离开时继续执行
      scrollWrap.children().hover(function() {
        clearInterval(timer);
      }, function() {
        timer = setInterval(slideUpAnimate, option.time);  //继续执行动画
      })
    };

    /*muTabs: tab切换*/
    $.fn.muTabs = function(view, callback) {

      var tabWrap = $(this),
        tabs = tabWrap.children(),
        views = $(view).children();

      $.each(tabs, function(index, val) {
        $(val).on('click', function() {
          tabs.removeClass('active');
          $(this).addClass('active');
          views.removeClass('show');
          views.eq(index).addClass('show');

          if (typeof callback === 'function') {
            callback($(this));
          }
        })
      });
    };
    /*checkFileTypeAndSize: 上传图片类型判断*/
    $.fn.checkFileTypeAndSize = function(options) {
      //默认设置
      var defaults = {
        allowedExtensions: 'jpeg,jpg,png',
        maxSize: 2 * 1024 * 1024, //单位是byte
        success: function() {
        },
        extensionerror: function() {
        },
        sizeerror: function() {
        }
      };
      //合并设置
      options = $.extend(defaults, options);
      //遍历元素
      return this.each(function() {
        $(this).on('change', function() {
          //获取文件路径
          var filePath = $(this).val();
          //小写字母的文件路径
          var fileLowerPath = filePath.toLowerCase();
          //获取文件的后缀名
          var extension = fileLowerPath.substring(fileLowerPath.lastIndexOf('.') + 1);
          //判断后缀名是否包含在预先设置的、所允许的后缀名数组中
          if ($.inArray(extension, options.allowedExtensions.split(',')) == -1) {
            options.extensionerror();
            $(this).focus();
          } else {
            try {
              var size = 0;
              if ($.browser && $.browser.msie) {//ie旧版浏览器
                var fileMgr = new ActiveXObject('Scripting.FileSystemObject');
                var fileObj = fileMgr.getFile(filePath);
                size = fileObj.size; //byte
              } else {//其它浏览器
                size = $(this)[0].files[0].size;//byte
              }
              if (size > options.maxSize) {
                options.sizeerror();
              } else {
                options.success();
              }
            } catch (e) {
              J_app.alert('错误：' + e);
            }
          }
        });
      });
    };
  })(jQuery);


  // 使用rem初始化页面,自执行
  (function() {
    var page = this;
    var html = document.getElementsByTagName('html')[0];
    page.width = 320;
    page.fontSize = 100;
    page.widthProportion = function() {
      var p = (html.offsetWidth) / page.width;
      return p > 2 ? 2 : p < 1 ? 1 : p;
    };
    page.changePage = function() {
      html.setAttribute('style', 'font-size:' + page.widthProportion() * page.fontSize + 'px !important');
    };
    page.changePage();
    window.addEventListener('resize', function() {
      page.changePage();
    }, false);
  })();

  // 事件绑定
  (function($) {
    // 关注达人
    J_app.favAction();

    // 投票
    J_app.voteAction();

    // 帮TA拉票
    J_app.inviteInTable();

    // 搜索
    J_app.search();
  })(jQuery);

  //头部固定栏跳转
  (function($) {
    // back
    $('.J-back').on('click', function() {
      var href = $(this).data('src');
      if (href) {
        window.location.href = href;
      } else {
        window.history.back();
      }
    });
    // 回到首页
    $('.J-home').on('click', function() {
      window.location.href = "./index.html";
    });
    // 刷新
    $('.J-refresh').on('click', function() {
      window.location.reload();
    });
  })(jQuery);

  // 全局按钮触摸事件
  (function($) {
    $(document).on('touchstart', '.J-touch', function() {
      $(this).addClass('active');
    }).on('touchend', '.J-touch', function() {
      $(this).removeClass('active');
    });
  })(jQuery);

  // 回到顶部
  (function($) {
    $(window).scroll(function() {
      if ($(this).scrollTop() > 400) {
        $('.ui-gotop').fadeIn();
      } else {
        $('.ui-gotop').fadeOut();
      }
    });

    $('.ui-gotop').on('click', function() {
      $('body, html').stop(true).animate({scrollTop: 0}, 400);
      return false;
    });
  })(jQuery);

  // 抛出对象
  factory && (global.J_app = J_app);
});