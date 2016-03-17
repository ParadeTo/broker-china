/*
 * 模拟交易
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});

  // 请求观点列表
  handler.loadUserInfo();
  handler.loadEventRadio();
  handler.loadUserAssets();
};

// 获取用户信息
handler.loadUserInfo = function() {

  J_app.ajax(J_app.api.joinDetail, {}, function(data){

    var html;

    if(data.code === 0){
      data.result.yieldColor = J_app.yieldColor(data.result.yield);
      html = template('trade/userInfo', data);
    } else{
      console.log(data.message);
    }

    $('#userInfo').empty().append(html);
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

// 获取个人资产
handler.loadUserAssets = function() {

  J_app.ajax(J_app.api.ptfDetail, {}, function(data){
    if(data.code === 0){
      if(data.result) {
        var stks = data.result.stks;

        data.result.cash = stks[stks.length-1].tBal;
        stks.pop();

        $('#stkList').append(template('trade/takeList', {stks:stks}));
        $('#userAssets').empty().append(template('trade/userStatis', data));
      }
    }
  });
};

// 执行
$(function() {
  handler.init();
});