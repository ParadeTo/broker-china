/*
 * 榜单
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // tab切换
  $('#rankTab').muTabs($('#rankContent'),handler.fetchRankList);

  // 请求广告
  J_app.adverst(2202);
  J_app.inviteOrg($('#rankOrg'));

  // 请求观点列表
  handler.fetchUserInfo();
  handler.fetchEventDetail();
  handler.fetchEventRadio();
  handler.fetchGuestInfo();
  handler.fetchRankList();
  handler.moreRankList();
};

// 获取用户信息
handler.fetchUserInfo = function() {

  function userInfo(session){
    var params = {};

    if(session){
      params['sessionId'] = session;
    }

    J_app.ajax(J_app.api.joinDetail, params, function(data){
      if(data.code === 0){

        // 如果是游客
        if(data.result.adviserStatus === 0){
          J_app.fachinaStatus(data.result.joinStatus, data.result.adviserStatus);
        }
        // 如果是注册用户
        else{
          // 存储cId
          $.cookie("fachinaId", data.result.cId, {expires:365,path:'/'});
          // 存储用户状态
          J_app.fachinaStatus(data.result.joinStatus, data.result.adviserStatus);
          // 存储用户身份
          $.cookie('fachinaType', data.result.adviserStatus, {expires:365,path:'/'});
          // 存储用户姓名，头像，参赛id，机构
          $('body').append(template('common/hidden', data));
        }
      } else {
        J_app.alert(data.message);
      }
    });
  }

  // 如果检测没有cId
  if(!$.cookie('fachinaId')){

    // 如果在一起牛APP
    if(J_app.yiqiniu){
      jYiqiniu.getSessionId(userInfo);
    } else{
      $.cookie('fachinaStatus', 1, {expires:365,path:'/'});
      $.cookie('fachinaType', 1, {expires:365,path:'/'});
      $('#userStatus').addClass('status-1');
      J_app.updateNavbar();
    }
  } else{
    userInfo();
  }
};

// 获取赛事信息
handler.fetchEventDetail = function() {
  J_app.ajax(J_app.api.eventDetail, {}, function(data){
    if(data.code === 0){
      $('#indexBanner').append(template('common/eventDetail', data));
    }
  });
};

// 获取赛事直播
handler.fetchEventRadio = function() {
  var params = {};

  params['type'] = 'C';
  params['count'] = 10;
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

// 获取展示区用户信息
handler.fetchGuestInfo = function() {

  var params = {};
  params['joinId'] = J_app.getUrlParam('joinId');

  if($.cookie('fachinaId') || params['joinId']) {
    J_app.ajax(J_app.api.joinDetail, params, function(data){
      if(data.code === 0){

        // 判断显示的是谁
        if(J_app.getUrlParam('joinId')){
          data.result.identity = 'I';
        } else{
          data.result.identity = 'M';
        }
        $('#guestInfo').empty().append(template('ranking/guestInfo', data));
      } else{
        J_app.alert(data.message);
      }
    });
  }
};

// 获取榜单
handler.fetchRankList = function(obj,readId,more) {

  J_app.loading(true);

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

    J_app.loading(false);

    var trHtml;

    if(data.code === 0){
      trHtml = template('ranking/' + tplName, J_app.tmpData(data.result));

      if(data.result.hasNext === 1){
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').show();
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').data('readId',data.result.readId);
      } else{
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').hide();
      }
    } else{
      trHtml = template('common/errorTable5', data);
    }

    if(more){
      $('#' + viewId).append(trHtml);
    } else{
      $('#' + viewId).empty().append(trHtml);
    }
  }, function(){
    J_app.loading(false);
    var errHtml = template('common/errorTable5', {message:'请求超时'});
    if(more){
      $('#' + viewId).append(errHtml);
    } else{
      $('#' + viewId).empty().append(errHtml);
    }
  });
};

// 加载更多
handler.moreRankList = function() {
  $('.ui-more').on('click', function(){
    var $this = $(this),
        readId = $this.data('readId');
    handler.loadRankList($this, readId, true);
  });
};

// 给自己转发拉票
handler.inviteVote = function() {
  $('#guestInfo').on('click', '.J-invite-guest', function(){
    var option = {};

    option['url'] = J_app.host + '/webstatic/fachina/ranking.html?joinId=' + $('#globalUserJoinId').val();
    option['title'] = $('#globalUserName').val() + '邀您参加投顾大赛';
    option['desc'] = '我参加了投顾大赛，快来帮我投票吧！';
    option['img'] = $('#globalUserImg').val();

    J_app.inviteAction(option);
  });
};

// 帮主屏用户拉票
handler.inviteGuest = function() {

  //邀请好友参赛
  $('#guestInfo').on('click', '.J-invite-guest', function(){
    var option = {};

    option['url'] = J_app.host + '/webstatic/fachina/ranking.html?joinId=' + $('#globalUserJoinId').val();
    option['title'] = $('#globalUserName').val() + '邀您参加投顾大赛';
    option['desc'] = '我参加了投顾大赛，快来帮我投票吧！';
    option['img'] = $('#globalUserImg').val();

    J_app.inviteAction(option);
  });
};

// 主屏用户投票
handler.voteGuest = function() {
  $('#guestInfo').on('click', '.J-vote-guest', function(){
    J_app.loading(true);

    var $this = $(this);
    J_app.checkSign(function () {
      var params = {};
      if ($this.hasClass('J-locked')) {
        return;
      }
      $this.addClass('J-locked');

      params['joinId'] = $this.data('id');
      J_app.ajax(J_app.api.vote, params, function (data) {
        J_app.loading(false);
        $this.removeClass('J-locked');
        if (data.code === 0) {
          if(data.result.voteCount === 0){
            $this.removeClass('btn-red J-vote-guest').addClass('btn-orange J-invite-guest').html('帮TA拉票');
          } else{
            $this.html('再投1票');
          }
        } else {
          J_app.alert(data.message);
        }
      }, function () {
        J_app.loading(false);
        J_app.alert('请求超时！');
        $this.removeClass('J-locked');
      });
    });
  });
};

// 执行
$(function() {
  handler.init();
});