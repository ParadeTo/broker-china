/*
 * 个人中心
 * author： qinxingjun
 */

var handler = window.handler || {};

// 邀请的投顾阅读id
handler.readId = 0;

// 初始化
handler.init = function() {

  J_app.loginStatus();
  handler.fetchUserInfo();
  handler.fetchVoteList();
  handler.fetchInviteList();
  handler.moreInviteList();
};

// 获取用户信息
handler.fetchUserInfo = function() {
  J_app.ajax(J_app.api.joinDetail, {}, function(data){
    if(data.code === 0){
      $('#banner').empty().append(template('home/userInfo', data));
      if(data.result.joinStatus === 0){

        // 如果没参赛，显示报名按钮
        $('#statis').append(template('home/enrollBtn'));
      } else{
        $('#statis').append(template('home/userStatis', data));
      }
    } else{
      $('#statis').append(template('common/error', data));
    }
  }, function(){
    $('#statis').append(template('common/loadFail'));
  });
};

// 投票投顾
handler.fetchVoteList = function() {

  var params = {};

  params['type'] = 'V';
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.joinList, params, function(data){
    if(data.code === 0){
      if(data.result.datas){
        $('#voteList').empty().append(template('home/list', J_app.tmpData(data.result)));
        $('#voteBox').show();
      }
    }else{
      $('#voteList').empty().append(template('common/errorTable5', data));
      $('#voteBox').show();
    }
  });
};

// 邀请投顾
handler.fetchInviteList = function() {

  var params = {};

  params['type'] = 'I';
  params['count'] = 5;
  params['readId'] = handler.readId;

  J_app.ajax(J_app.api.joinList, params, function(data){
    if(data.code === 0){

      // 是否有数据
      if(data.result.datas){
        $('#inviteList').append(template('home/list', J_app.tmpData(data.result)));
        if($('#inviteBox').is(':hidden')){
          $('#inviteBox').show();
        }
      }

      //是否有分页
      $('#inviteMore').css('display', (data.result.hasNext ? 'block' : 'none'));
      handler.readId = data.result.readId;
    }else{
      $('#inviteList').append(template('common/errorTable5', data));
      if($('#inviteBox').is(':hidden')){
        $('#inviteBox').show();
      }
    }
  });
};

// 加载更多邀请投顾
handler.moreInviteList = function() {
  $('#inviteMore').on('click', handler.fetchInviteList);
};

$(function() {

  // 没登录将跳转到首页
  if(!J_app.getCookie('id')){
    window.location.href = './index.html';
  } else{
    handler.init();
  }
});