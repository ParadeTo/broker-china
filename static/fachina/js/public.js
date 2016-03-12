/*
 * name:    投顾大赛公用js；
 * version: 2.0
 * info:    基于jquery
 * more:    支持的接口及功能请查看相应的文档，支持模块化调用
 * update:  2016-02-25
 */

!function (global, factory) {
  "function" == typeof define && (define.amd || define.cmd) ? define(function () {
    return factory(global)
  }) : factory(global, !0)
}(this, function (global, factory) {

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

    //当日委托
    todayOrders: (development ? devHost : host) + "/g_adviser_api/fetch_simu_ptf_today_orders",

    //调仓
    simuOrder: (development ? devHost : host) + "/g_adviser_api/simu_order",

    //撤单预检
    withdrawCheck: (development ? devHost : host) + "/g_adviser_api/check_simu_ptf_withdraw",

    //撤单
    withdrawOrder: (development ? devHost : host) + "/g_adviser_api/simu_ptf_withdraw",

    //历史委托
    historyOrders: (development ? devHost : host) + "/g_adviser_api/fetch_simu_his_order_detail",

    //市场全局搜索
    searchMkt: (development ? devHost : host) + "/g_adviser_api/search_mkt",

    //五档行情
    fiveBets: (development ? devHost : host) + "/g_adviser_api/get_five_bets",

    // 获取微信签名
    fetchJssdk: (development ? devHost : host) + "/g_adviser_api/fetch_js_sdk_signature",

    //获取省、直辖市列表
    province: (development ? devHost : host) + "/g_adviser_api/fetch_province",

    //获取城市列表
    city: (development ? devHost : host) + "/g_adviser_api/fetch_city"
  };

  var links = {
    register: host + (development ? '/html/' : '/webstatic/') + 'fachina/register.html'
  };

  var params = {
    cId: $.cookie("fachinaId")
  };

  // 抛出对象
  var J_app = {

    /*主机名*/
    host: host,

    /*接口*/
    api: apis,

    // 页面跳转
    link: links,

    // 公用参数
    param: params,

    /*获取url中的参数*/
    getUrlParam: function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
        r = window.location.search.substr(1).match(reg);

      if (r != null) {
        return decodeURIComponent(r[2]);
      } else {
        return null;
      }
    },

    /*生成唯一数*/
    onlyNum: function () {
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

    /*为空处理*/
    isNull: function (text) {
      if (typeof text === "undefined" || text === null) {
        return '';
      } else {
        return text;
      }
    },

    /*AJAX请求封装，data需传递对象*/
    ajax: function (url, data, callback, error) {

      var params = {};
      params['params'] = data;
      params['id'] = J_app.onlyNum();

      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(params),
        dataType: "json",
        contentType: "application/json",
        success: callback,
        error: function () {
          if (error) {
            error();
          } else {
            console.log("请求失败");
          }
        }
      });
    },

    /*计算时间差，参数为时间戳*/
    timeDifference: function (timestamps) {
      var formatNumber = function (n) {
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

    //微信分享
    shareByWeixin: function (b, t, d, l, i) {

      var pageUrl = window.location.href;
      var title = t;
      var desc = d;
      var link = l;
      var imgUrl = i;
      var options = {};

      var params = {
        url: pageUrl
      };
      /*获取签名*/
      promotion.ajax(apis.fetchJssdk, params, function (data) {
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
      }, promotion.ajaxFail, {});

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

        wx.ready(function () {

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
    },

    //提示类弹窗
    alert: function (text, time) {

      if (typeof time === 'undefined' || typeof time !== 'number') {
        time = 2000;
      }

      var _html = [];

      _html.push('<div class="ui-alert">');
      _html.push('<div class="ui-alert-main">' + text + '</div>');
      _html.push('</div>');

      $('body').append(_html.join(''));
      $(".ui-alert").fadeIn();

      setTimeout(function () {
        $('.ui-alert').remove();
      }, time);
    },

    // 确认弹窗
    confirm: function (opt) {

      var option = {
        title: '标题',
        main: '',
        sure: function () {
          console.log('你执行了确认操作！');
        },
        cancel: function () {
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
      _html.push('<div class="ui-col col-2"><button class="btn btn-gray J-dialog-cancel">' + option.cancelBtnText + '</button></div>');
      _html.push('<div class="ui-col col-2"><button class="btn btn-red J-dialog-sure">' + option.sureBtnText + '</button></div>');
      _html.push('</div></div>');

      $('body').append(_html.join(''));

      $('.J-dialog-cancel').unbind('click');
      $('.J-dialog-sure').unbind('click');

      $('.J-dialog-cancel').on('click', option.cancel);
      $('.J-dialog-sure').on('click', function () {
        option.sure();
        $(this).closest('.ui-dialog').remove();
      });
    },

    //在一起牛APP打开
    notAtYiqiniu: function () {

      var _html = [];

      _html.push('<div class="niu-at-yiqiniu">');
      _html.push('<div class="niu-at-yiqiniu-img">');
      _html.push('<img src="' + J_app.host + '/static/common/images/logo120.png" alt="">');
      _html.push('</div>');
      _html.push('<div class="niu-at-yiqiniu-text">请在一起牛客户端打开链接！</div>');
      _html.push('</div>');

      $('body').empty().append(_html.join(''));
      $('title').text('抱歉，出错了');
    },

    //加载失败
    loadFail: function () {

      var _html = [];

      _html.push('<div class="ui-loading-fail">');
      _html.push('<div class="loading-fail-img">');
      _html.push('<img src="' + J_app.host + '/static/common/images/icon_fail.png" alt="">');
      _html.push('</div>');
      _html.push('<div class="loading-fail-text">抱歉，出错啦！</div>');
      _html.push('</div>');

      $('body').empty().append(_html.join(''));
      $('title').text('请求错误');
    },

    // 加载动画
    loading: function (type) {
      if (type) {
        $('body').append('<div class="ui-loading"><div class="loader"></div></div>');
      } else {
        $('.ui-loading').remove();
      }
    },

    // 判断是否登录公用方法
    checkSign: function (callback) {
      if (!$.cookie("fachinaId")) {
        window.location.href = J_app.link.register;
      } else {
        callback();
      }
    },

    // 我要参赛
    joinEvent: function () {
      $("#joinEvent").click(function () {
        // 判断是否登录
        J_app.checkSign(function () {
          window.location.href = "enroll_entry.html";
        })
      });
    },

    // 投票
    vote: function () {
      $(document).on('click', '.J-vote', function () {

        var _this = $(this);

        J_app.checkSign(function () {

          var numberBox = _this.parent().find('.total-number'),
            number = parseInt(numberBox.html()),
            params = {};

          if (_this.hasClass('J-locked')) {
            return;
          }
          _this.addClass('J-locked');

          params['joinId'] = _this.data('id');

          J_app.ajax(J_app.api.vote, params, function (data) {

            _this.removeClass('J-locked');

            if (data.code === 0) {

              J_app.alert('投票成功！');

              numberBox.html(++number);

              if (data.result.voteCount === 1) {
                _this.html('再投一票');
              } else {
                _this.removeClass('J-vote').addClass('J-vote-share').html('帮TA拉票');
              }
            } else {
              J_app.alert(data.message);
            }
          }, function () {
            J_app.alert('请求失败！');
            _this.removeClass('J-locked');
          });
        });
      });
    },

    // 搜索
    search: function () {
      $("#global-search").click(function () {
        // 获取搜索关键字
        var keyword = $("#search-keyword").val();
        if (keyword) {
          window.location.href = encodeURI("search.html?keyword=" + keyword);
        } else {
          J_app.alert("请输入关键词");
        }
      });
    },

    // 广告栏
    ad: function (p) {
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
          swiper = new Swiper('#adDiscover', options);
      }

      // 测试
      $.ajax({
        type: 'GET',
        url: '../ad_api/fetch_ad_link_list.json',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          if (data.code === 0) {
            if (data.result && data.result.datas) {

              var ads = data.result.datas;
              var imgsHtml = [];

              for (var i = 0; i < ads.length; i++) {

                imgsHtml.push('<div class="swiper-slide">');
                imgsHtml.push('<a id="' + ads[i].adId + '" href="' + ads[i].adUrl + '" style="background-image:url(' + ads[i].adImg + ')"></a>');
                imgsHtml.push('</div>');
              }
              $('#adImages').empty().append(imgsHtml.join(''));

              if (ads.length > 1) {
                addSwiping();
              }
              setTimeout(function () {
                $('#adCtrls').fadeIn(1000);
              }, 500);
            }
          } else {
            console.log(data.message);
          }
        }
      });
    }
  };

 // Jquery扩展方法
  (function ($) {
    /*
     * muSlideUp：向上定时无缝滚动动画
     * @option.time: 滚动间隔时间
     * @option.speed: 滚动速度
     * 使用方法：$('#demo').muSlideUp({time:5000,speed: 500})
     */
    $.fn.muSlideUp = function (option) {

      var scrollWrap = $(this),
        childHeight = scrollWrap.height(),
        timer;

      //默认参数
      option = $.extend({
        "time": 3000,
        "speed": 1000
      }, option);

      //向上滑动动画
      function slideUpAnimate() {
        scrollWrap.children().first().animate(
          {marginTop: -childHeight},
          option.speed,
          function () {
            $(this).css("margin-top", 0).appendTo(scrollWrap);
          })
      }

      //自动间隔时间向上滑动
      timer = setInterval(slideUpAnimate, option.time);

      //悬停时停止滑动，离开时继续执行
      scrollWrap.children().hover(function () {
        clearInterval(timer);
      }, function () {
        timer = setInterval(slideUpAnimate, option.time);  //继续执行动画
      })
    };

    /*muTabs: tab切换*/
    $.fn.muTabs = function (view, callback) {

      var tabWrap = $(this),
        tabs = tabWrap.children(),
        views = $(view).children();

      $.each(tabs, function (index, val) {
        $(val).on('click', function () {
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
  })(jQuery);

 // 使用rem初始化页面,自执行
  (function () {
    var page = this;
    var html = document.getElementsByTagName("html")[0];
    page.width = 320;
    page.fontSize = 100;
    page.widthProportion = function () {
      var p = (html.offsetWidth) / page.width;
      return p > 2 ? 2 : p < 1 ? 1 : p;
    };
    page.changePage = function () {
      html.setAttribute("style", "font-size:" + page.widthProportion() * page.fontSize + "px !important");
    };
    page.changePage();
    window.addEventListener("resize", function () {
      page.changePage();
    }, false);
  })();

 // 事件绑定
  (function ($) {
    J_app.joinEvent();  // 报名参赛
    J_app.vote(); // 投票
    J_app.search(); // 搜索
  })(jQuery);

  //头部固定栏跳转
  (function($) {
    // back
    $('.J-back').on('click', function(){
      var href = $(this).data('href');
      if(href){
        window.location.href = href;
      } else{
        window.history.back();
      }
    });
    // 回到首页
    $('.J-home').on('click', function(){
      window.location.href = "./index.html";
    });
    // 刷新
    $('.J-refresh').on('click', function(){
      window.location.reload();
    });
  })(jQuery);

  // 全局按钮触摸事件
  (function ($) {
    $(document).on('touchstart', '.J-touch', function () {
      $(this).addClass('active');
    }).on('touchend', '.J-touch', function () {
      $(this).removeClass('active');
    });
  })(jQuery);

 //用户登录状态
  (function ($) {
    if ($.cookie('fachinaStatus')) {
      $('#userStatus').addClass('status-' + $.cookie('fachinaStatus'));
    } else {
      console.log('登录出错');
    }
  })(jQuery);

 //回到顶部
  (function ($) {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 400) {
        $('.ui-gotop').fadeIn();
      } else {
        $('.ui-gotop').fadeOut();
      }
    });

    $('.ui-gotop').on('click', function () {
      $('body, html').stop(true).animate({scrollTop: 0}, 400);
      return false;
    });
  })(jQuery);

 //抛出对象
  factory && (global.J_app = J_app);
})
;