/**
 * 注册
 * Created by ayou on 2016-03-01.
 */

var handler = window.handler || {};
var time = 60;
var iTime = time;
var timer;

// 错误标记
handler.errorType = {
  phone: false,
  authClick: false,
  auth: false,
  pw: false
};

// 验证表单
function validForm(params) {
  // 验证手机
  if(!J_app.validPhone(params['certCode'])) {
    $('#validError').html('<p>请输入11位手机号</p>');
    handler.errorType.phone = true;
    return false;
  }
  // 验证验证码
  if(!params['eventId']) {
    $('#validError').html('<p>请获取验证码</p>');
    handler.errorType.authClick = true;
    return false;
  }
  if(!J_app.validCaptcha(params['captcha'])) {
    $('#validError').html('<p>请输入4位验证码，不能包含空格</p>');
    handler.errorType.auth = true;
    return false;
  }
  // 验证密码
  if(!J_app.validPw(params['pwd'])) {
    $('#validError').html('<p>请输入6~16位密码，不能包含空格</p>');
    handler.errorType.pw = true;
    return false;
  }
  return true;
}

//倒计时
function countDown(){
  if(iTime>0){
    $('#register-body-identify-btn').html('('+iTime+')').attr('disabled',true);
    iTime--;
    timer = setTimeout(countDown,1000);
  }else{
    iTime=time;
    clearTimeout(timer);
    $('#register-body-identify-btn').html('获取验证码').attr('disabled',false).removeClass('locked');
  }
}

// 获取验证码
handler.getCaptcha = function() {
  $('#register-body-identify-btn').click(function() {
    // 清除验证提示信息
    if(handler.errorType.authClick) {
      handler.errorType.authClick = false;
      $('#validError').html('');
    }

    var phone = $('#register-body-phone').val();
    var $this = $(this);

    // 验证手机号
    if(!J_app.validPhone(phone)){
      $('#validError').html('<p>请输入11位手机号</p>');
      handler.errorType.phone = true;
      return ;
    }

    // 如果已被锁定,返回
    if($this.hasClass('locked')) {
      return ;
    }

    // 锁定，倒计时
    $this.addClass('locked');
    countDown();

    // 获取验证码
    var params = {};
    params['phoneNum'] = phone;
    J_app.ajax(J_app.api.captcha, params, function(data){
      if(data.code === 0){
        // 得到事件id
        handler.eventId = data.result.eventId;
      } else {
        J_app.alert(data.message);
      }
    },function() {
      J_app.alert('请求超时！');
    });
  });
};

// 发送注册请求
handler.registerReq = function(obj) {
  var $this = obj ? $(obj) : $('#register-btn-register');
  var params = {};
  var inviteUserId = J_app.getCookie('invite');

  // 获取电话、验证码、密码
  params['certCode'] = $('#register-body-phone').val();
  params['captcha'] = $('#register-body-identify-input').val();
  params['pwd'] = $('#register-body-password').val();
  // 凭证
  params['certType'] = 0;
  // 事件id
  params['eventId'] = handler.eventId;

  // 如果有邀请用户
  if(inviteUserId){
    params['invUserId'] = inviteUserId;
  }

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
      // 注册成功，设置cookie
      J_app.setCookie('id', data.result.cId);
      window.location.href = './index.html';
    } else {
      J_app.alert(data.message);
    }
    iTime = 0;
  },function() {
    $this.removeClass('locked');
    J_app.loading(false);
    J_app.alert('请求超时！');
  });
}

// 注册
handler.register = function() {
  $('#register-btn-register').click(function() {
    handler.registerReq($(this));
  });

  // 软键盘注册
  $(document).on('keydown', function(event){
    if(event.keyCode === 13){
      handler.registerReq();
    }
  });
}

// 清除验证提示信息
handler.clearErrorMsg = function() {
  // 电话
  $('#register-body-phone').focus(function() {
    if(handler.errorType.phone) {
      handler.errorType.phone = false;
      $('#validError').html('');
    }
  });
  // 验证码
  $('#register-body-identify-input').focus(function() {
    if(handler.errorType.auth) {
      handler.errorType.auth = false;
      $('#validError').html('');
    }
  });
  // 密码
  $('#register-body-password').focus(function() {
    if(handler.errorType.pw) {
      handler.errorType.pw = false;
      $('#validError').html("");
    }
  });
}

// 初始化
handler.init = function() {
  // 错误提示内容置为空
  $('#validError').html('');
  // 绑定登录跳转
  $('#register-btn-login').attr('href','login.html');
}

$(function() {
  // 屏蔽微信分享
  J_app.shareByWeixin(true);

  handler.init();
  handler.clearErrorMsg();
  handler.register();
  handler.getCaptcha();
});