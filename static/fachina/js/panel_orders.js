/*
 * 模拟交易-查询
 * author： qinxingjun
 */

var handler = window.handler || {};

handler.readId = 0;

// 初始化
handler.init = function() {

  // 委托查询
  handler.loadOrderList();
  handler.moreOrderList();
};

// 委托查询
handler.loadOrderList = function() {
  var params = {};

  params['cId'] = J_app.param.cId;
  params['ordType'] = 'T';

  J_app.ajax(J_app.api.orderDetail, params, function(data){

    var trHtml;

    if(data.code === 0){
      trHtml = template('panel/panelOrders', data.result);

      if(data.result.stkOrds){
        handler.readId = data.result.stkOrds[data.result.stkOrds.length-1].ordId;
      }else{
        trHtml = template('common/noData', {"message":"咱无今日委托"});
      }
    } else{
      trHtml = template('common/error', data);
    }

    $('#orderList').empty().append(trHtml);
  });
};

// 查看历史查询
handler.moreOrderList = function() {

  $('#orderMore').on('click', function() {

    var $this = $(this),
        params = {};

    if($this.hasClass('locked')){
      return false;
    }
    $this.addClass('locked');

    J_app.loading(true);

    params['cId'] = J_app.param.cId;
    params['ordType'] = 'H';
    params['locatedOrderId'] = handler.readId;
    params['pageSize'] = 5;

    J_app.ajax(J_app.api.orderDetail, params, function(data){

      $this.removeClass('locked');
      J_app.loading(false);

      var trHtml;

      if(data.code === 0){

        if(data.result.stkOrds){
          trHtml = template('panel/panelOrders', data.result);
        } else{
          $this.data('status', 'N').html('没有更多');
        }
      } else{
        trHtml = template('common/error', data);
      }

      $('#orderList').append(trHtml);
    },function(){
      $this.removeClass('locked');
      J_app.loading(false);
    });
  });
};

$(function() {
  handler.init();
});