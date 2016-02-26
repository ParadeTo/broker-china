/*
* name:    一起牛JSSDK
* version: 1.0.0
* info:    需要调用一起牛APP接口及功能时使用，如果页面在非一起牛APP内打开，接口将无效
* more:    支持的接口及功能请查看相应的文档，支持模块化调用
* update:  2015-12-25
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
      jYiqiniu; // JS对象

  //错误文案
  var error = {
    atApp: "请在一起牛APP内打开",
    param: "参数错误！",
    notSupport: "客户端暂不支持此接口"
  };

  //对象合并方法
  function extend(o,n){
    for(var p in n){
      if(n.hasOwnProperty(p) && o.hasOwnProperty(p)){
        o[p]=n[p];
      }
    }
  };

  //IOS版APP内监听bridge
  function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge);
    }else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        callback(WebViewJavascriptBridge);
      }, false);
    };
  }

  //如果在IOS版的APP内，JS桥（bridge）接通后初始化
  if(isYiqiniu){
    if(isIos){
      connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(data, responseCallback) {});
      });
    }
  }

  //通过方法处理,暂无
  function globalFunction(callback) {
  }

  //方法声明
  jYiqiniu = {

    /*获取当前用户的sessionId，需要传递回调函数，回调函数含参数*/
    getSessionId: function(callback) {
      if(callback && typeof callback === "function"){
        if(isYiqiniu){
          if(isAndroid){
            callback(QiNiuClient.getSessionId());
          }
          if(isIos){
            var param = {
            "functionName" : "getSessionId"
            };
            connectWebViewJavascriptBridge(function(bridge) {

              bridge.send(param,function(data){
                callback(data);
              });
            });
          }
        }else{
          console.log(error.atApp);
        }
      }else{
        console.log(error.param);
      }
    },

    /*获取当前用户的userId,需要传递回调函数，回调函数含参数*/
    getUserId: function(callback) {
      if(callback && typeof callback === "function"){
        if(isYiqiniu){
          if(isAndroid){
            callback(QiNiuClient.getSessionId());
          }
          if(isIos){
            var param = {
            "functionName" : "getSessionId"
            };
            connectWebViewJavascriptBridge(function(bridge) {

              bridge.send(param,function(data){
                callback(data);
              });
            });
          }
        }else{
          console.log(error.atApp);
        }
      }else{
        console.log(error.param);
      }
    },

    /*获取跳转链接类型,需要传递回调函数，回调函数含参数*/
    getPageOpenType: function(callback) {
      if(callback && typeof callback === "function"){
        if(isYiqiniu){
          if(isAndroid){
            callback(QiNiuClient.getPageOpenType());
          }
          if(isIos){
            var param = {
            "functionName" : "getPageOpenType"
            };
            connectWebViewJavascriptBridge(function(bridge) {

              bridge.send(param,function(data){
                callback(data);
              });
            });
          }
        }else{
          console.log(error.atApp);
        }
      }else{
        console.log(error.param);
      }
    },

    /*获取获取设备信息,需要传递回调函数，回调函数含参数*/
    getDeviceInfo: function(callback) {
      if(callback && typeof callback === "function"){
        if(isYiqiniu){
          if(isAndroid){
            callback(QiNiuClient.getDeviceInfo());
          }
          if(isIos){
            var param = {
            "functionName" : "getDeviceInfo"
            };
            connectWebViewJavascriptBridge(function(bridge) {

              bridge.send(param,function(data){
                callback(data);
              });
            });
          }
        }else{
          console.log(error.atApp);
        }
      }else{
        console.log(error.param);
      }
    },

    /*触发上传通讯录,可传递回调函数，如果全局设置了onActionDone函数，可不传。*/
    getContact: function(callback) {

      //如果没有定义全局函数onActionDone，则将回调函数设置为onActionDone;
      if(callback && typeof callback === "function"){
        !window.onActionDone && (window.onActionDone = callback);
      }

      if(isYiqiniu){
        if(isAndroid){
          QiNiuClient.getContact();
        }
        if(isIos){
          var param = {
          "functionName" : "getContact"
          };
          connectWebViewJavascriptBridge(function(bridge) {

            bridge.send(param);
          });
        }
      }else{
        console.log(error.atApp);
      }
    },

    /*检查更新，无需传递参数，APP端自动完成检查*/
    checkUpdate: function() {
      if(isYiqiniu){
        if(isAndroid){
          callback(QiNiuClient.checkUpdate());
        }
        if(isIos){
          var param = {
          "functionName" : "checkUpdate"
          };
          connectWebViewJavascriptBridge(function(bridge) {

            bridge.send(param,function(data){
              callback(data);
            });
          });
        }
      }else{
        console.log(error.atApp);
      }
    },

    /*点击图片的处理,需要传递图片url，参数为sting类型，APP端会自动处理*/
    onClickImg: function(imgUrl) {
      if(imgUrl && typeof imgUrl === "string"){
        if(isYiqiniu){
          if(isAndroid){
            callback(QiNiuClient.onClickImg(imgUrl));
          }
          else{
            console.log(error.notSupport);
          }
        }else{
          console.log(error.atApp);
        }
      }else{
        console.log(error.param);
      }
    },

    /*跳转到系统设置，目前仅支持IOS*/
    systemSet: function() {
      if(isYiqiniu){
        if(isIos){
          var param = {
            "functionName" : "systemSet"
          };
          connectWebViewJavascriptBridge(function(bridge) {

            bridge.send(param);
          });
        }else{
          console.log(error.notSupport);
        }
      }else{
        console.log(error.atApp);
      }
    },

    /*IOS获取是否打开通知，目前仅支持IOS*/
    callRemoteNotification: function() {
      if(isYiqiniu){
        if(isIos){
          var param = {
            "functionName" : "callRemoteNotification"
          };
          connectWebViewJavascriptBridge(function(bridge) {

            bridge.send(param);
          });
        }else{
          console.log(error.notSupport);
        }
      }else{
        console.log(error.atApp);
      }
    },

    /*自定义分享，需传递分享参数*/
    share: function(option) {

      var opt = {
        title: document.getElementsByTagName("title")[0].innerHTML,
        desc: document.getElementsByTagName("title")[0].innerHTML,
        url: window.location.href,
        img: window.location.protocol + "//" + window.location.host + "/static/common/images/logo120.png",
        aim: "['timeline','wechat','qq']"
      }

      //复制对象
      if(option){
        extend(opt,option);
      }

      if(isYiqiniu){
        if(isAndroid){
           QiNiuClient.share(opt.url, opt.title, opt.desc, opt.img,opt.aim);
        }
        if(isIos){
            var param = {
              "functionName" : "share",
              "params":{
                "title" : opt.title,
                "desc" : opt.desc,
                "imgUrl" : opt.img,
                "link" : opt.url,
                "aimList" : opt.aim
              }
          }
          connectWebViewJavascriptBridge(function(bridge) {

            bridge.send(param);
          });
        }
      }else{
        console.log(error.atApp);
      }
    },

    /*默认分享，需传递分享参数，安卓调用此方法，IOS用分享参数写在html内*/
    shareDefault: function(option) {

      var opt = {
        title: document.getElementsByTagName("title")[0].innerHTML,
        desc: document.getElementsByTagName("title")[0].innerHTML,
        url: window.location.href,
        img: window.location.protocol + "//" + window.location.host + "/static/common/images/logo120.png",
        aim: "['timeline','wechat','qq']"
      }

      //复制对象
      if(option){
        extend(opt,option);
      }

      if(isYiqiniu){
        if(isAndroid){
           QiNiuClient.onReceivedShareInfo(opt.url, opt.title, opt.desc, opt.img,opt.aim);
        }
        else{
          console.log(error.notSupport);
        }
      }else{
        console.log(error.atApp);
      }
    }
  };

  //抛出对象
  factory && (global.jYiqiniu = jYiqiniu);
});