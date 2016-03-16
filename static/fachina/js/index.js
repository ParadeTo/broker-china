/*
 * 个人中心
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // tab切换
  $('#rankTab').muTabs($('#rankContent'),handler.loadRankList);

  // 请求广告
  J_app.adverst(2201);
  J_app.inviteOrg($('#rankOrg'));

  // 请求观点列表
  handler.loadUserInfo();
  handler.loadEventDetail();
  handler.loadEventRadio();
  handler.loadRankList();
  handler.loadViewpointList();
  handler.inviteActive();
  handler.inviteJoinGame();
};

// 获取用户信息
handler.loadUserInfo = function() {
  if(!J_app.param.cId){
    $.cookie('fachinaStatus', 1, {expires:365,path:'/'});
    $('#userStatus').addClass('status-1');
    $('#joinBtnBox').empty().append(template('index/joinBtn', {status: J_app.param.status}));
  } else{
    J_app.ajax(J_app.api.joinDetail, {}, function(data){
      if(data.code === 0){
        J_app.fachinaStatus(data.result.joinStatus, data.result.adviserStatus);
        $('#joinBtnBox').empty().append(template('index/joinBtn', {status: J_app.param.status, result: data.result}));
      }
    });
  }
};

// 获取赛事信息
handler.loadEventDetail = function() {
  var params = {};

  J_app.ajax(J_app.api.eventDetail, params, function(data){

    var detailHtml;

    if(data.code === 0){
      detailHtml = template('common/eventDetail', data);
      $('#eventDate').addClass('date-' + data.result.season);
    } else{
      detailHtml = template('common/error', data);
    }

    $('#indexBanner').append(detailHtml);
  });
};

// 获取赛事直播
handler.loadEventRadio = function() {

  var params = {};

  params['type'] = 'C';
  params['count'] = 10;
  params['readId'] = 0;

  J_app.ajax(J_app.api.noteList, params, function(data){

    var listData = {},
        listHtml;

    listData['urlHost'] = J_app.host;

    if(data.code === 0){
      if(data.result){
        $.extend(listData, data.result);
      }
      listHtml = template('index/eventRadio', listData);
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
handler.loadRankList = function(t) {

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

    var trHtml;

    if(data.code === 0){
      trHtml = template('index/' + tplName, J_app.tmpData(data.result));
    } else{
      trHtml = template('common/error', data);
    }

    $('#' + viewId).empty().append(trHtml);
  }, function(){
    $('#' + viewId).empty().append(template('common/loadFail'));
  });
};

// 获取观点列表
handler.loadViewpointList = function() {

  var params = {};

  params['type'] = 'H';
  params['count'] = 5;
  params['readId'] = 0;

  J_app.ajax(J_app.api.noteList, params, function(data){

    var listData = {},
        listHtml;

    listData['urlHost'] = J_app.host;

    if(data.code === 0){
      if(data.result){
        $.extend(listData, data.result);
      }
      listHtml = template('index/viewpointList', listData);
    } else{
      listHtml = template('common/error', data);
    }

    $('#viewpointList').empty().append(listHtml);
  },function(){
    $('#viewpointList').empty().append(template('common/loadFail'));
  });
};

// 邀请好友参赛
handler.inviteJoinGame = function() {
  $(document).on('click', '.J-invite', function(){
    if(J_app.agent.isWeixin){
      // 修改微信分享地址；
      J_app.wxShareNotice();
    } else if(J_app.agent.isYiqiniu){

    } else {
      J_app.alert('请关注券商中国');
    }
  });
};

$(function() {
  handler.init();
});