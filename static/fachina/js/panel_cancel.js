/*
 * 模拟交易-撤单
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // 委托查询
  handler.loadOrderList();
  handler.cancelAction();
};

// 查询可撤单列表
handler.loadOrderList = function() {
  var params = {};

  params['cId'] = J_app.param.cId;

  J_app.ajax(J_app.api.todayOrders, params, function(data){

    var trHtml;

    if(data.code === 0){

      var stks = data.result.stkOrds,
          newStks = [];

      for(var i=0; i<stks.length; i++){
        if(stks[i].displayStatus === 'A' || stks[i].displayStatus === 'B'){
          newStks.push(stks[i]);
        }
      }

      trHtml = template('panel/panelCancel', { "stks" : newStks});
    } else{
      trHtml = template('common/error', data);
    }

    $('#orderList').empty().append(trHtml);
  });
};

// 撤单操作
handler.cancelAction = function() {
  $(document).on('click', 'table', function(){
    var option = {
      title: '委托撤单确认',
      main: template('panel/dialogCancel', {}),
      sure: function(){
        handler.loadOrderList();
      }
    };
    J_app.confirm(option);
  });
};

$(function() {
  handler.init();
});