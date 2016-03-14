/*
 * 个人中心
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});
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
};

// 获取用户信息
handler.loadUserInfo = function() {
  if(!J_app.param.cId){
    $.cookie('fachinaStatus', 1, {expires:365,path:'/'});
  } else{
    J_app.ajax(J_app.api.joinDetail, {}, function(data){
      if(data.code === 0){
        if(data.result.joinStatus === 0){
          $.cookie('fachinaStatus', 2, {expires:365,path:'/'});
        } else if(data.result.joinStatus === 1) {
          $.cookie('fachinaStatus', 3, {expires:365,path:'/'});
        } else if(data.result.joinStatus === 2) {
          $.cookie('fachinaStatus', 4, {expires:365,path:'/'});
        } else {
          $.cookie('fachinaStatus', 5, {expires:365,path:'/'});
        }
        $('#joinBtnBox').empty().append(template('index/joinBtn', data));
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
      trHtml = template('index/' + tplName, data.result);
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

// 转发邀请
handler.inviteActive = function() {
  $('#inviteEvent').on('click', function(){
    J_app.checkSign(function(){

      // 需要区分在一起牛或者微信
      J_app.wxShareNotice();
    })
  });
};

// 投顾拉票
handler.voteShareActive = function() {

  $(document).on('click', '.J-invite', function(){
    // 修改微信分享地址；

    // 弹出分享提示
    J_app.wxShareNotice();
  });
};

$(function() {
  handler.init();
});