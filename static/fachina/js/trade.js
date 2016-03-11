/*
 * 模拟交易
 * author： qinxingjun
 */

var tradeHandler = window.tradeHandler || {};

// 初始化
tradeHandler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});

  // 请求观点列表
  tradeHandler.loadUserInfo();
  tradeHandler.loadEventRadio();
  tradeHandler.loadUserAssets();
};

// 获取用户信息
tradeHandler.loadUserInfo = function() {

  var params = {};

  params['joinId'] = 7;

  J_app.ajax(J_app.api.joinDetail, params, function(data){

    var html;

    if(data.code === 0){
      html = template('trade/userInfo', data);
    } else{
      console.log(data.message);
    }

    $('#userInfo').empty().append(html);
  });
};

// 获取赛事直播
tradeHandler.loadEventRadio = function() {

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

// 获取个人资产
tradeHandler.loadUserAssets = function() {

  var params = {};

  params['cId'] = $.cookie("fachinaId");

  J_app.ajax(J_app.api.ptfDetail, params, function(data){

    var trHtml;

    if(data.code === 0){
      $('#totalAssets').html(data.result.mktVal);
      trHtml = template('trade/takeList', data.result);

      $('#stkList').append(trHtml);
    }
  });
};

// 转发邀请
tradeHandler.inviteActive = function() {

  $('#inviteEvent').on('click', function(){
    J_app.checkSign(function(){
      console.log('弹出分享提示');
    })
  });
};

// 投票
//tradeHandler.voteActive = function() {
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
//      J_app.ajax(J_app.api.joinList, params, function(data){
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
//        } else{
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
tradeHandler.voteShareActive = function() {

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

  tradeHandler.init();
});