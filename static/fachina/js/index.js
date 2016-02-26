/*
 * 个人中心
 * author： qinxingjun
 */

var homeHandler = window.homeHandler || {};

// 初始化
homeHandler.init = function() {

};

// 赛事直播
homeHandler.init = function() {

};

$(function() {

  /*测试登录代码*/
  if(!$.cookie("fachinaId")){
    var params = {};
    params['certType'] = '0';
    params['certCode'] = '13402810264';
    params['pwd'] = '666666';

    J_app.ajax(J_app.api.login, params, function(data){

      if(data.code === 0){
        $.cookie("fachinaId", data.result.cId, {expires:365,path:'/'});
        console.log('登录成功！');
      } else{
        J_app.alert(data.message);
      }
    });
  }

  homeHandler.init();
});