/*
 * 个人中心
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // tab切换
  $('#rankTab').muTabs($('#rankContent'),handler.fetchRankList);

  // 请求广告
  J_app.adverst(2201);
  J_app.inviteOrg($('#rankOrg'));

  // 请求观点列表
  handler.saveInviteUserId();
  handler.fetchEventDetail();
  handler.fetchEventRadio();
  handler.fetchRankList();
  handler.fetchViewpointList();
  handler.inviteJoin();
  handler.inviteVote();
  handler.checkJoinBtn();
};

// 如果是邀请链接，存储邀请id
handler.saveInviteUserId = function(){
  var inviteUserId = J_app.getUrlParam('inId');

  if(inviteUserId){
    J_app.setCookie('invite', inviteUserId);
  }
};

// 赛事按钮
handler.checkJoinBtn = function() {
  $('#joinBtnBox').append(template('index/joinBtn', {status: J_app.getCookie('status')}));
};

// 获取赛事信息
handler.fetchEventDetail = function() {

  function ENToCN(n) {
    switch(n) {
      case 0:
        return '一';
      case 1:
        return '二';
      case 2:
        return '三';
      case 3:
        return '四';
      default:
        return '--';
    }
  }

  J_app.ajax(J_app.api.eventDetail, {}, function(data){
    if(data.code === 0){
      $('#indexBanner').append(template('common/eventDetail', data));

      if(data.result.eventTimes){
        var times = data.result.eventTimes;

        if(times.length > 0){
          for(var i=0; i<times.length; i++){
            times[i].eventSeason = ENToCN(i);
          }
        }
        $('#eventDate')
        .append(template('common/eventTimes', data.result))
        .addClass('date-' + data.result.season);
      }
    } else{
      $('#indexBanner').append(template('common/error', data));
    }
  });
};

// 获取赛事直播
handler.fetchEventRadio = function() {

  var params = {};

  params['type'] = 'C';
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.noteList, params, function(data){

    var listHtml = '';
    if(data.code === 0){
      listHtml = template('index/eventRadio', data.result);
    } else{
      listHtml = template('common/error', data);
    }

    $('#eventRadio').empty().append(listHtml);
    $('#eventRadio').muSlideUp({time:3000});
  },function(){
    $('#eventRadio').empty().append(template('common/loadFail'));
  });
};

// 获取榜单
handler.fetchRankList = function(t) {

  J_app.loading(true);

  var type = t ? t.data('type') : 'A',
      params = {},
      tplName,
      viewId;

  if(type === 'A'){
    tplName = 'rankAdviser';
    viewId = 'rankAdviser';
  } else if(type === 'O'){
    tplName = 'rankOrg';
    viewId = 'rankOrg';
  } else{
    tplName = 'rankElite';
    viewId = 'rankElite';
  };

  params['type'] = type;
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.joinList, params, function(data){

    J_app.loading(false);
    var trHtml;

    if(data.code === 0){
      trHtml = template('index/' + tplName, J_app.tmpData(data.result));
    } else{
      trHtml = template('common/errorTable5', data);
    }

    $('#' + viewId).empty().append(trHtml);
  }, function(){
    J_app.loading(false);
    $('#' + viewId).empty().append(template('common/errorTable5', {message:'请求超时！'}));
  });
};

// 获取观点列表
handler.fetchViewpointList = function() {

  var params = {};

  params['type'] = 'H';
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.noteList, params, function(data){

    var listHtml;

    if(data.code === 0){
      listHtml = template('index/viewpointList', data.result);
    } else{
      listHtml = template('common/error', {message: data.message, class: 'padding'});
    }

    $('#viewpointList').empty().append(listHtml);
  },function(){
    $('#viewpointList').empty().append(template('common/loadFail', {class: 'padding'}));
  });
};

// 邀请朋友参赛
handler.inviteJoin = function() {

  //邀请好友参赛
  $('#inviteEvent').on('click', function(){

    var cId = J_app.getCookie('id');
    var option = {};
    var inviteUrl = J_app.host + '/webstatic/fachina/index.html';

    if(cId){
      inviteUrl += ('?inId=' + cId);
    }

    option['url'] = inviteUrl;
    option['title'] = '参加投顾大赛，赢取万元奖金！';
    option['desc'] = '参加投顾大赛，赢取万元奖金！';
    option['img'] = J_app.host + '/static/fachina/images/pic_share.jpg';

    J_app.inviteAction(option);
  });
};

// 转发拉票
handler.inviteVote = function() {

  //邀请好友参赛
  $('#joinBtnBox').on('click', '.J-invite-alone', function(){
    var option = {};

    option['url'] = J_app.host + '/webstatic/fachina/ranking.html?joinId=' + $('#globalUserJoinId').val();
    option['title'] = $('#globalUserName').val() + '邀您参加投顾大赛';
    option['desc'] = '我参加了投顾大赛，快来帮我投票吧！';
    option['img'] = $('#globalUserImg').val();

    J_app.inviteAction(option);
  });
};

$(function() {
  J_app.userInfoInit(handler.init);
});