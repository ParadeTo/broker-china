/**
 * 登录
 * Created by ayou on 2016-02-29.
 */

var loginHandler = window.homeHandler || {};

// 验证手机号
loginHandler.valid = function(){
  $("#login-body-phone").blur(function() {
    var val = this.val();
    alert(val);
  });
};

//


$(function() {

  loginHandler.valid();
});