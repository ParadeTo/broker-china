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
  indexHandler.loadViewpointList();
  indexHandler.loadRankList();
  indexHandler.voteActive();

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

// 投票
indexHandler.voteActive = function() {

  $(document).on('click', '.J-vote', function() {


    var _this = $(this),
        numberBox = _this.parent().find('.total-number');
        number = parseInt(numberBox.html());
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
};

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

  indexHandler.init();
});