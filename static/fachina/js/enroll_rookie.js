/**
 * 报名参赛
 * Created by ayou on 2016-03-03.
 */

// 验证姓名
function validName(name) {
  var re = /^[\u4e00-\u9fa5]{1,5}$/;
  if (re.test(name)) {
    return true;
  } else {
    return false;
  }
}

var enrollRookieHandler = window.enrollRookieHandler || {};

// 报名参赛跳转
enrollRookieHandler.api = "index.html";

// 小白 rookie
enrollRookieHandler.rookieInit = function () {
  // 绑定报名参赛跳转
  $('#enroll-2-btn').click(function () {
    var $this = $(this);
    // 得到真实姓名
    var realName = $('#enroll-2-name').val();
    // 验证姓名
    if (!validName(realName)) {
      $('#enroll-2-error').html("请输入真实姓名");
      return;
    }
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);
    // 报名
    var params = {};
    params['realName'] = realName;
    J_app.ajax(J_app.api.join, params, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        J_app.alert("报名成功");
        setTimeout(function(){
          window.location.href = enrollRookieHandler.api;
        }, 1000);
      } else {
        $("#enroll-2-error").html("<p>" + data.message + "</p>");
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('请求超时！');
    });
  });
  // 输入框获取焦点时清除错误信息
  $('#enroll-2-name').focus(function () {
    $('#enroll-2-error').html("");
  });
};

$(function () {
  J_app.checkSign(function() {
    enrollRookieHandler.rookieInit();
  });
});