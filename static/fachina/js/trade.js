/*
 * 模拟交易
 * author： qinxingjun
 */

var tradeHandler = window.tradeHandler || {};

// 初始化
tradeHandler.init = function() {

  $('#tradeTab').muTabs($('#tradeContent'),function(){
    console.log('你点击了我');
  });

  // 请求观点列表
  //tradeHandler.loadEventDetail();
};

// 获取赛事信息
tradeHandler.loadEventDetail = function() {
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



$(function() {

  tradeHandler.init();
});