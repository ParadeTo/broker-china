/**
 * 报名参赛
 * Created by ayou on 2016-03-03.
 */

function validName(name) {
  var re = /^[\u4e00-\u9fa5]{1,5}$/;
  if(re.test(name)){
    return true;
  }else{
    return false;
  }
}

$(function() {
  var api = "index.html";

  // 绑定报名参赛跳转
  $('#enroll-2-btn').click(function() {
    // 得到cId
    var cId = $.cookie("fachinaId");
    // 得到真实姓名
    var realName = $('#enroll-2-name').val();
    // 验证姓名
    if(!validName(realName)){
      $('#enroll-2-error').html("请输入真实姓名");
      return ;
    }
    // 报名
    var params = {};
    params['cId'] = cId;
    params['realName'] = realName;
    J_app.ajax(J_app.api.join, params, function(data) {
      console.log(params);
      console.log(data);
      if(data.code === 0) {
        // 报名参赛成功后跳转

      } else {
        $("#enroll-2-error").html("<p>" + data.message + "</p>");
      }
    },function() {
      J_app.alert('请求失败！');
    });
  });
  // 输入框获取焦点时清除错误信息
  $('#enroll-2-name').focus(function() {
    $('#enroll-2-error').html("");
  });
});