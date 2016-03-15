/**
 * 登录
 * Created by ayou on 2016-02-29.
 */

var loginHandler = window.homeHandler || {};

// 验证手机号
function validPhone(phone) {
  re= /^\d{11}$/;
  if(re.test(phone)){
    return true;
  }
}

// 初始化
loginHandler.init = function() {
  // 输入手机和密码时删除验证提示
  $('#login-body-phone').focus(function() {
    $("#validError").html("");
  });
  $('#login-body-password').focus(function() {
    $("#validError").html("");
  });
  // 注册按钮
  $('#login-btn-register').attr("href","register.html");
}

// 登录
loginHandler.login = function(){
  $('#login-btn-login').click(function() {
    var $this = $(this);
    var phone = $("#login-body-phone").val();
    var password = $('#login-body-password').val();

    // 验证手机号
    if(!validPhone(phone)) {
      $("#validError").html("<p>请输入11位手机号</p>");
      return ;
    }

    // 密码为空
    if(typeof password === undefined) {
      $("#validError").html("<p>请输入密码</p>");
      return ;
    }

    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');

    // 加载动画
    J_app.loading(true);

    // 登录
    var params = {};
    params['certType'] = '0';
    params['certCode'] = phone;
    params['pwd'] = password;
    J_app.ajax(J_app.api.login, params, function(data){

      $this.removeClass('locked');
      J_app.loading(false);

      if(data.code === 0){
        $.cookie("fachinaId", data.result.cId, {expires:365,path:'/'});

        // 存储用户状态
        J_app.fachinaStatus(data.result.joinStatus, data.result.adviserStatus);
        window.location.href = "./enroll_entry.html";
      } else {
        $("#validError").html("<p>" + data.message + "</p>");
      }
    },function() {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('请求失败！');
    });
  });
}

$(function() {
  loginHandler.init();
  loginHandler.login();
});