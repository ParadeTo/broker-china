/**
 * 注册
 * Created by ayou on 2016-03-01.
 */

var registerHandler = window.homeHandler || {};
var time = 60;
var iTime = time;
var timer;

// 验证手机号
function validPhone(phone) {
  re= /^\d{11}$/;
  if(re.test(phone)){
    return true;
  }
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
    var phone = $('#register-body-phone').val();
    var $this = $(this);
    // 验证手机号
    if(!validPhone(phone)){
      $("#validError").html("<p>请输入11位手机号</p>");
      // 标识错误
      registerHandler.error = 0;
      return ;
    }

    // 如果已被锁定
    if($this.hasClass("locked")) {
      return ;
    }

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
        $("#validError").html("<p>" + data.message + "</p>");
      }
    },function() {
      J_app.alert('请求失败！');
    });
  });
};

// 注册
registerHandler.register = function() {
  $('#register-btn-register').click(function() {
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


    // 验证手机
    if(!validPhone(params['certCode'])) {
      $("#validError").html("<p>请输入11位手机号</p>");
      return ;
    }

    // 验证验证码
    if(!params['captcha'] || !params['eventId']) {
      $("#validError").html("<p>请输入验证码</p>");
      return ;
    }

    // 验证密码
    if(!params['pwd']) {
      $("#validError").html("<p>请输入密码</p>");
      return ;
    }

    J_app.ajax(J_app.api.register, params, function(data) {
      console.log(data);
      if(data.code === 0) {
        // 注册成功，设置cookie，跳转到首页
        $.cookie("fachinaId", data.result.cId, {expires:365,path:'/'});
        window.location.href = "index.html";
      } else {
        $("#validError").html("<p>" + data.message + "</p>");
      }
      iTime = 0;
    },function() {
      J_app.alert('请求失败！');
    });
  });

}

// 初始化
registerHandler.init = function() {
  // 错误提示内容置为空
  $('#validError').html("");
  // 输入手机号时，错误提示内容为空
  $('#register-body-phone').focus(function() {
    $('#validError').html("");
  });
  // 输入验证码时，错误提示内容为空
  $('#register-body-identify-input').focus(function() {
    $('#validError').html("");
  });
  // 绑定登录跳转
  $('#register-btn-login').attr("href","login.html");
}


$(function() {
  registerHandler.init();
  registerHandler.register();
  registerHandler.getCaptcha();
});