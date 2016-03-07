/*
 * 个人中心
 * author： qinxingjun
 */

var homeHandler = window.homeHandler || {};

// 初始化
homeHandler.init = function() {

  homeHandler.loadVoteList();
  homeHandler.loadInviteList();
  homeHandler.loadUserInfo();
};

// 获取投顾信息
homeHandler.loadUserInfo = function() {

  var params = {};

 // params['cId'] = $.cookie("fachinaId");
  params['joinId'] = 1;

  J_app.ajax(J_app.api.joinDetail, params, function(data){

    if(data.code === 0){
      $('#homeBanner').empty().append(template('home/userInfo', data));
      $('#homeStatis').empty().append(template('home/userStatis', data));
    } else{
      J_app.alert(data.message);
    }
  });
};

// 获取
homeHandler.loadVoteList = function() {

  var type = 'V',
      params = {};

  params['type'] = type;
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.joinList, params, function(data){

    var trHtml;

    if(data.code === 0){
      trHtml = template('home/list', data.result);
    } else{
      trHtml = template('common/error', data);
    }

    $('#myVoteAdviser').empty().append(trHtml);
  }, function(){
    $('#myVoteAdviser').empty().append(template('common/loadFail'));
  });
};

homeHandler.loadInviteList = function() {

  var type = 'I',
      params = {};

  params['type'] = type;
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.joinList, params, function(data){

    var trHtml;

    if(data.code === 0){
      trHtml = template('home/list', data.result);
    } else{
      trHtml = template('common/error', data);
    }

    $('#myInviteAdviser').empty().append(trHtml);
  }, function(){
    $('#myInviteAdviser').empty().append(template('common/loadFail'));
  });
};

$(function() {
  homeHandler.init();
});