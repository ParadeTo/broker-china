/*
 * 模拟交易-查询
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // 委托查询
  handler.loadTodayOrder();
  handler.loadHistoryOrder();
};

// 当日委托
handler.loadTodayOrder = function() {

  J_app.loading(true);

  var params = {};

  J_app.ajax(J_app.api.todayOrders, params, function(data){

    J_app.loading(false);

    var trHtml;

    if(data.code === 0){

      if(data.result.stkOrds.length > 0){
        trHtml = template('panel/panelOrders', data.result);
        $('#orderMore').show();
      }else{

        // 如果没有今日委托，自动加载历史委托
        $('#orderMore').trigger('click');
      }
    } else{
      J_app.alert(data.message);
    }

    $('#orderList').empty().append(trHtml);
  }, function(){
    J_app.loading(false);
    J_app.alert('请求超时！');
  });
};

// 历史委托
handler.loadHistoryOrder = function() {

  var readId = 0;

  $('#orderMore').on('click', function() {

    var $this = $(this),
        params = {};

    if($this.data('status') === 'N'){
      return false;
    }

    if($this.hasClass('locked')){
      return false;
    }
    $this.addClass('locked');

    J_app.loading(true);

    params['pageSize'] = readId;
    params['pagerId'] = 10;

    J_app.ajax(J_app.api.historyOrders, params, function(data){

      $this.removeClass('locked');
      J_app.loading(false);

      var trHtml;

      if(data.code === 0){

        $this.show();

        if(data.result.stkOrds.length > 0){
          trHtml = template('panel/panelOrders', data.result);
          $this.html('<a href="javascript:;">点击查看更多</a>');
        } else{
          $this.data('status', 'N').html('<a href="javascript:;">没有更多委托</a>');
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

// 执行
$(function() {
  J_app.userInfoInit(function(){

    // 没登录将进行登录
    if(!J_app.getCookie('id')){
      window.location.href = J_app.navControl('./trade.html', 'trade');
    } else{
      if(J_app.getCookie('status') === '2'){
        // 需要报名参赛
        $('body').append(template('trade/notJoin'));
      } else if(J_app.getCookie('status') === '3'){
        // 审核中
        $('body').append(template('trade/validing'));
      } else{
        if(J_app.errorMessage === 1){
          J_app.joinError();
        } else{
          handler.init();
        }
      }
    }
  });
});