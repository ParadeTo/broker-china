/**
 * 登录
 * Created by ayou on 2016-02-29.
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {
  // 输入手机和密码时删除验证提示
  $('#login-body-phone').focus(function() {
    $('#validError').html('');
  });
  $('#login-body-password').focus(function() {
    $('#validError').html('');
  });
  // 注册按钮
  $('#login-btn-register').attr('href','register.html');
};

// 发送登录请求
handler.loginReq = function(obj){

  var $this = obj ? $(obj) : $('#login-btn-login');
  var phone = $('#login-body-phone').val();
  var password = $('#login-body-password').val();
  var inviteUserId = J_app.getCookie('invite');

  // 防重发
  if($this.hasClass('locked')){
    return ;
  }
  $this.addClass('locked');

  // 验证手机号
  if(!J_app.validPhone(phone)) {
    $('#validError').html('<p>请输入11位手机号</p>');
    return ;
  }

  // 验证密码
  if(!J_app.validPw(password)) {
    $('#validError').html('<p>请输入密码</p>');
    return ;
  }

  // 加载动画
  J_app.loading(true);

  // 登录
  var params = {};
  params['certType'] = '0';
  params['certCode'] = phone;
  params['pwd'] = password;

  // 如果有邀请用户
  if(inviteUserId){
    params['invUserId'] = inviteUserId;
  }

  J_app.ajax(J_app.api.login, params, function(data){

    $this.removeClass('locked');
    J_app.loading(false);

    if(data.code === 0){
      // 登录成功，设置cookie
      J_app.setCookie('id', data.result.cId);

      var src = J_app.getUrlParam('src');
      if(!src){
        src = 'index';
      }
      window.location.href = src + '.html';
    } else {
      $('#validError').html('<p>' + data.message + '</p>');
    }
  },function() {
    $this.removeClass('locked');
    J_app.loading(false);
    J_app.alert('请求超时！');
  });
};

// 登录
handler.login = function(){

  // 按钮登录
  $('#login-btn-login').on('click', function() {
    handler.loginReq($(this));
  });

  // 软键盘登录
  $(document).on('keydown', function(event){
    if(event.keyCode === 13){
      handler.loginReq();
    }
  });
};

$(function() {
  handler.init();
  handler.login();
});