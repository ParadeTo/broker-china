/*
 * 个人中心
 * author： qinxingjun
 */

var handler = window.handler || {};

// 邀请的投顾阅读id
handler.readId = 0;

// 初始化
handler.init = function() {

  handler.loadUserInfo();
  handler.loadVoteList();
  handler.loadInviteList();
  handler.moreInviteList();
};

// 获取投顾信息
handler.loadUserInfo = function() {

  // 传空请求
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
      J_app.alert(data.message);
    }
  });
};

// 投票投顾
handler.loadVoteList = function() {

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
      J_app.alert(data.message);
    }
  });
};

// 邀请投顾
handler.loadInviteList = function() {

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
      J_app.alert(data.message);
    }
  });
};

// 加载更多邀请投顾
handler.moreInviteList = function() {
  $('#inviteMore').on('click', handler.loadInviteList);
};

$(function() {
  handler.init();
});