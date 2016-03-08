/*
 * 个人中心
 * author： qinxingjun
 */

var indexHandler = window.indexHandler || {};

// 初始化
indexHandler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});
  $('#rankTab').muTabs($('#rankContent'),indexHandler.loadRankList);

  // 请求观点列表
  indexHandler.loadEventDetail();
  indexHandler.loadEventRadio();
  indexHandler.loadViewpointList();
  indexHandler.loadRankList();
  indexHandler.voteActive();
  indexHandler.joinActive();
  indexHandler.inviteActive();
};
// 获取赛事信息
indexHandler.loadEventDetail = function() {
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
indexHandler.loadEventRadio = function() {

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
indexHandler.loadRankList = function(t) {

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
indexHandler.loadViewpointList = function() {

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
indexHandler.inviteActive = function() {

  $('#inviteEvent').on('click', function(){
    J_app.checkSign(function(){
      console.log('弹出分享提示');
    })
  });
};

// 投票
//indexHandler.voteActive = function() {
//
//  $(document).on('click', '.J-vote', function() {
//
//    var _this = $(this);
//
//    J_app.checkSign(function(){
//
//      var numberBox = _this.parent().find('.total-number'),
//        number = parseInt(numberBox.html()),
//        params = {};
//
//      if(_this.hasClass('J-locked')){
//        return;
//      }
//      _this.addClass('J-locked');
//
//      params['joinId'] = _this.data('id');
//
//      J_app.ajax(J_app.api.vote, params, function(data){
//
//        _this.removeClass('J-locked');
//
//        if(data.code === 0){
//
//          J_app.alert('投票成功！');
//
//          numberBox.html(++number);
//
//          if(data.result.voteCount === 1){
//            _this.html('再投一票');
//          } else{
//            _this.removeClass('J-vote').addClass('J-vote-share').html('帮TA拉票');
//          }
//        } else {
//          J_app.alert(data.message);
//        }
//      },function(){
//        J_app.alert('请求失败！');
//        _this.removeClass('J-locked');
//      });
//    });
//  });
//};

// 拉票
indexHandler.voteShareActive = function() {

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
    params['certCode'] = '15878763719';
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

  // 用户状态
  if(!$.cookie("fachinaId")){
    $.cookie('fachinaStatus', 1, {expires:365,path:'/'});
  } else{
    var params = {};

    //params['cId'] = $.cookie("fachinaId");
    params['joinId'] = 1;

    J_app.ajax(J_app.api.joinDetail, params, function(data){

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
      }
    });
  }

  indexHandler.init();
});