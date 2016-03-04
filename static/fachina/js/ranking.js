/*
 * 榜单
 * author： qinxingjun
 */

var rankHandler = window.rankHandler || {};

// 初始化
rankHandler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});
  $('#rankTab').muTabs($('#rankContent'),rankHandler.loadRankList);

  // 请求观点列表
  rankHandler.loadEventDetail();
  rankHandler.loadEventRadio();
  rankHandler.loadRankList();
  rankHandler.voteActive();
  rankHandler.joinActive();
  rankHandler.inviteActive();
  rankHandler.loadListMore();
  rankHandler.loadUserInfo();
};
// 获取赛事信息
rankHandler.loadEventDetail = function() {
  var params = {};

  J_app.ajax(J_app.api.eventDetail, params, function(data){

    var detailHtml;

    if(data.code === 0){
      detailHtml = template('index/eventDetail', data);
    } else{
      detailHtml = template('common/error', data);
    }

    $('#indexBanner').append(detailHtml);
  });
};

// 获取赛事直播
rankHandler.loadEventRadio = function() {

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

// 获取用户信息
rankHandler.loadUserInfo = function() {

  var params = {};

  params['joinId'] = 7;

  J_app.ajax(J_app.api.joinDetail, params, function(data){

    var html;

    if(data.code === 0){
      html = template('ranking/userInfo', data);
    } else{
      console.log(data.message);
    }

    $('#userInfo').empty().append(html);
  });
};

// 获取榜单
rankHandler.loadRankList = function(obj,readId,more) {

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
rankHandler.loadListMore = function() {
  $(document).on('click', '.ui-more', function(){
    var readId = $(this).data('readId');

    rankHandler.loadRankList($(this), readId, true);
  });
};

// 我要参赛
rankHandler.joinActive = function() {

  $('#joinEvent').on('click', function(){
    J_app.checkSign(function(){
      window.location.href = './enroll_1.html';
    })
  });
};

// 转发邀请
rankHandler.inviteActive = function() {

  $('#inviteEvent').on('click', function(){
    J_app.checkSign(function(){
      console.log('弹出分享提示');
    })
  });
};

// 投票
rankHandler.voteActive = function() {

  $(document).on('click', '.J-vote', function() {

    var _this = $(this);

    J_app.checkSign(function(){

      var numberBox = _this.parent().find('.total-number'),
        number = parseInt(numberBox.html()),
        params = {};

      if(_this.hasClass('J-locked')){
        return;
      }
      _this.addClass('J-locked');

      params['joinId'] = _this.data('id');

      J_app.ajax(J_app.api.joinList, params, function(data){

        _this.removeClass('J-locked');

        if(data.code === 0){

          J_app.alert('投票成功！');

          numberBox.html(++number);

          if(data.result.voteCount === 1){
            _this.html('再投一票');
          } else{
            _this.removeClass('J-vote').addClass('J-vote-share').html('帮TA拉票');
          }
        } else{
          J_app.alert(data.message);
        }
      },function(){
        J_app.alert('请求失败！');
        _this.removeClass('J-locked');
      });
    });
  });
};

// 拉票
rankHandler.voteShareActive = function() {

  $(document).on('click', '.J-vote-share', function(){
    // 修改微信分享地址；

    // 弹出分享提示
  });
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

  rankHandler.init();
});