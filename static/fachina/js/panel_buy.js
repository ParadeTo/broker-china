/*
 * 模拟交易
 * author： qinxingjun
 */

var tradeHandler = window.tradeHandler || {};

tradeHandler.cId = $.cookie("fachinaId");

// 初始化
tradeHandler.init = function() {

  $('#tradeTab').muTabs($('#tradeContent'),function(){
    console.log('你点击了我');
  });

  // 委托查询
  tradeHandler.loadOrderList();
  tradeHandler.loadCancelList();
};

// 撤单预检
tradeHandler.loadCancelList = function() {
  var params = {};

  params['cId'] = tradeHandler.cId;

  J_app.ajax(J_app.api.withdrawCheck, params, function(data){

    var listHtml;

    if(data.code === 0){
      if(data.result){
        listHtml = template('trade/panelCancel', data.result);
      }
    } else{
      listHtml = template('common/error', data);
    }

    $('#cancelList').empty().append(listHtml);
  });
};

// 委托查询
tradeHandler.loadOrderList = function() {
  var params = {};

  params['cId'] = tradeHandler.cId;

  J_app.ajax(J_app.api.ptfOrders, params, function(data){
    if(data.code === 0){

    }
  });
};

// 加载委托详情
tradeHandler.loadOrderLista = function() {
  var params = {};

  params['cId'] = tradeHandler.cId;

  J_app.ajax(J_app.api.ptfOrders, params, function(data){

    var listHtml;

    if(data.code === 0){
      if(data.result){
        listHtml = template('trade/panelSearch', data.result);
      }
    } else{
      listHtml = template('common/error', data);
    }

    $('#searchList').empty().append(listHtml);
  });
};

$(function() {

  tradeHandler.init();
});