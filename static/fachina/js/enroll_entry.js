/**
 * 报名参赛
 * Created by ayou on 2016-03-03.
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {
  J_app.checkSign(function(){

    J_app.loading(true);

    if(J_app.getCookie('type') === '2'){
      J_app.ajax(J_app.api.join, {}, function(data){
        if(data.code === 0){
          J_app.loading(false);

          // 更新用户状态
          J_app.updateUserStatus();
          window.history.back();
        }else{
          J_app.alert(data.message);
        }
      });
    } else{
      // 显示参赛的页面
      $('#mainWrap').show();
    }
  });
};

// 执行
$(function() {
  handler.init();
});