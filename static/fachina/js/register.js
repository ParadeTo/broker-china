/**
 * 注册
 * Created by ayou on 2016-03-01.
 */

var registerHandler = window.homeHandler || {};
var time = 60;
var iTime = time;
var timer;

// 错误标记
registerHandler.errorType = {
  phone: false,
  auth: false,
  pw: false
};

// 验证手机号
function validPhone(phone) {
  var re = /^\d{11}$/;
  if(re.test(phone)) {
    return true;
  }
  return false;
}

// 验证密码
function validPw(pw) {
  var re = /^\S{6,16}$/;
  if(re.test(pw)) {
    return true;
  }
  return false;
}

// 验证表单
function validForm(params) {
  // 验证手机
  if(!validPhone(params['certCode'])) {
    $("#validError").html("<p>请输入11位手机号</p>");
    registerHandler.errorType.phone = true;
    return false;
  }
  // 验证验证码
  if(typeof params['captcha'] === undefined || typeof params['eventId'] === undefined) {
    $("#validError").html("<p>请输入验证码</p>");
    registerHandler.errorType.auth = true;
    return false;
  }
  // 验证密码
  if(!validPw(params['pwd'])) {
    $("#validError").html("<p>请输入6~16位密码,不能包含空格</p>");
    registerHandler.errorType.pw = true;
    return false;
  }
  return true;
}

//倒计时
function countDown(){
  if(iTime>0){
    $('#register-body-identify-btn').html("("+iTime+")").attr("disabled",true);
    iTime--;
    timer = setTimeout(countDown,1000);
  }else{
    iTime=time;
    clearTimeout(timer);
    $('#register-body-identify-btn').html("获取验证码").attr("disabled",false).removeClass("locked");
  }
}

// 获取验证码
registerHandler.getCaptcha = function() {
  $('#register-body-identify-btn').click(function() {
    // 清除验证提示信息
    if(registerHandler.errorType.auth) {
      registerHandler.errorType.auth = false;
      $("#validError").html("");
    }

    var phone = $('#register-body-phone').val();
    var $this = $(this);

    // 验证手机号
    if(!validPhone(phone)){
      $("#validError").html("<p>请输入11位手机号</p>");
      registerHandler.errorType.phone = true;
      return ;
    }

    // 如果已被锁定,返回
    if($this.hasClass("locked")) {
      return ;
    }

    // 锁定，倒计时
    $this.addClass("locked");
    countDown();

    // 获取验证码
    var params = {};
    params['phoneNum'] = phone;
    J_app.ajax(J_app.api.captcha, params, function(data){
      if(data.code === 0){
        // 得到事件id
        registerHandler.eventId = data.result.eventId;
      } else {
        J_app.alert(data.message);
      }
    },function() {
      J_app.alert('请求失败！');
    });
  });
};

// 注册
registerHandler.register = function() {
  $('#register-btn-register').click(function() {
    var $this = $(this);
    var params = {};

    // 获取邀请人id
    if(J_app.getUrlParam("invUserId")) {
      params['invUserId'] = J_app.getUrlParam("invUserId");
    }

    // 获取电话、验证码、密码
    params['certCode'] = $('#register-body-phone').val();
    params['captcha'] = $('#register-body-identify-input').val();
    params['pwd'] = $('#register-body-password').val();
    // 凭证
    params['certType'] = 0;
    // 事件id
    params['eventId'] = registerHandler.eventId;

    // 验证表单
    if(!validForm(params)) {
      return ;
    }

    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');

    // 加载动画
    J_app.loading(true);

    // 注册
    J_app.ajax(J_app.api.register, params, function(data) {

      $this.removeClass('locked');
      J_app.loading(false);

      if(data.code === 0) {
        // 注册成功，设置cookie，跳转到首页
        $.cookie("fachinaId", data.result.cId, {expires:365,path:'/'});
        J_app.fachinaStatus(data.result.joinStatus, data.result.adviserStatus);

        var src = J_app.getUrlParam('src');
        if(!src){
          src = './index';
        }
        window.location.href = src + '.html';
      } else {
        J_app.alert(data.message);
      }
      iTime = 0;
    },function() {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('请求失败！');
    });
  });

}

// 清除验证提示信息
registerHandler.clearErrorMsg = function() {
  // 电话
  $("#register-body-phone").focus(function() {
    if(registerHandler.errorType.phone) {
      registerHandler.errorType.phone = false;
      $("#validError").html("");
    }
  });
  // 验证码
  $('#register-body-identify-input').focus(function() {
    if(registerHandler.errorType.auth) {
      registerHandler.errorType.auth = false;
      $("#validError").html("");
    }
  });
  // 密码
  $('#register-body-password').focus(function() {
    if(registerHandler.errorType.pw) {
      registerHandler.errorType.pw = false;
      $("#validError").html("");
    }
  });
}

// 初始化
registerHandler.init = function() {
  // 错误提示内容置为空
  $('#validError').html("");
  // 绑定登录跳转
  $('#register-btn-login').attr("href","login.html");
}

$(function() {
  registerHandler.init();
  registerHandler.clearErrorMsg();
  registerHandler.register();
  registerHandler.getCaptcha();
});