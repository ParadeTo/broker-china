/*
 * 榜单
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});
  $('#rankTab').muTabs($('#rankContent'),handler.loadRankList);

  // 请求广告
  J_app.adverst(2202);
  J_app.inviteOrg($('#rankOrg'));

  // 请求观点列表
  handler.loadEventDetail();
  handler.loadEventRadio();
  handler.loadUserInfo();
  handler.loadRankList();
  handler.loadListMore();
  handler.inviteActive();
};

// 获取赛事信息
handler.loadEventDetail = function() {
  var params = {};

  J_app.ajax(J_app.api.eventDetail, params, function(data){

    var detailHtml;

    if(data.code === 0){
      detailHtml = template('common/eventDetail', data);
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

// 获取用户信息,分享用户优先级高!
handler.loadUserInfo = function() {

  var params = {};
  params['joinId'] = J_app.getUrlParam('joinId');

  J_app.ajax(J_app.api.joinDetail, params, function(data){
    if(data.code === 0){

      // 判断显示的是谁，用于区分按钮行为
      if(J_app.getUrlParam('joinId')){
        data.result.identity = 'I';
      } else{
        data.result.identity = 'M';
      }
      $('#userInfo').append(template('ranking/userInfo', data));
    } else{
      console.log(data.message);
    }
  });
};

// 获取榜单
handler.loadRankList = function(obj,readId,more) {

  var type = obj ? obj.data('type') : 'A',
      readId = readId ? readId : 0,
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
  params['count'] = 10;
  params['readId'] = readId;

  J_app.ajax(J_app.api.joinList, params, function(data){

    var trHtml;

    if(data.code === 0){
      trHtml = template('ranking/' + tplName, data.result);

      if(data.result.hasNext === 1){
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').show();
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').data('readId',data.result.readId);
      } else{
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').hide();
      }
    } else{
      trHtml = template('common/error', data);
    }

    if(more){
      $('#' + viewId).append(trHtml);
    } else{
      $('#' + viewId).empty().append(trHtml);
    }
  }, function(){
    $('#' + viewId).empty().append(template('common/loadFail'));
  });
};

// 加载更多
handler.loadListMore = function() {
  $(document).on('click', '.ui-more', function(){
    var readId = $(this).data('readId');

    handler.loadRankList($(this), readId, true);
  });
};

// 转发邀请
handler.inviteActive = function() {
  $('#inviteEvent').on('click', function(){
    J_app.checkSign(function(){
      console.log('弹出分享提示');
    })
  });
};

// 拉票
handler.voteShareActive = function() {

  $(document).on('click', '.J-vote-share', function(){
    // 修改微信分享地址；

    // 弹出分享提示
  });
};

// 执行
$(function() {
  handler.init();
});