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

        J_app.loading(false);

        if(data.code === 0){
          window.history.back();
        }else{
          J_app.alert(data.message);
        }
      }, function(){
        J_app.loading(false);
        J_app.alert('请求超时！');
      });
    } else{
      J_app.loading(false);

      // 显示参赛的页面
      $('#mainWrap').show();
    }
  });
};

// 执行
$(function() {
  handler.init();
});