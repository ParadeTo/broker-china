/*
 * 个人中心
 * author： qinxingjun
 */

/*
 *创建活动
 */

$(document).ready(function() {

  J_app.ajax(J_app.api.login, {}, function(data) {
    console.log(data);
  },null);

console.log(J_app.api.login);

$('#box').html('niha o');
});
