/**
 * ��¼
 * Created by ayou on 2016-02-29.
 */

var loginHandler = window.homeHandler || {};

// ��֤�ֻ���
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