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

  J_app.loading(true);

  var params = {};

  J_app.ajax(J_app.api.todayOrders, params, function(data){

    J_app.loading(false);

    var trHtml;

    if(data.code === 0){
      var stks = data.result.stkOrds,
        newStks = [];

      for(var i=0; i<stks.length; i++){
        if(stks[i].displayStatus === 'A' || stks[i].displayStatus === 'B'){
          newStks.push(stks[i]);
        }
      }

      if(newStks.length > 0){
        trHtml = template('panel/panelCancel', { stks : newStks});
      } else{
        $('.panel-cancel-list').after(template('common/noData', { message : '还没有数据'}));
      }
    } else{
      J_app.alert(data.message);
    }

    $('#cancelList').empty().append(trHtml);
  }, function(){
    J_app.loading(false);
    J_app.alert('请求超时');
  });
};

// 撤单操作
handler.cancelAction = function() {
  $('#cancelList').on('click', 'tr', function(){
    var $this = $(this);
    var data = {
      seq : $this.data('seq'),
      tId : $this.data('tid'),
      type : $this.data('type') === 'B' ? '撤买单' : '撤卖单',
      code : $this.data('code'),
      name : $this.data('name'),
      oprice : $this.data('oprc'),
      number : $this.data('oqty') - $this.data('cqty')
    };

    var option = {
      title: '委托撤单确认',
      main: template('panel/dialogCancel', data),
      sure: function(){
        handler.cancelSubmit(data);
      },
      sureText: '确定撤单'
    };
    J_app.confirm(option);
  });
};

// 撤单提交
handler.cancelSubmit = function(data) {

  function getExchType(code){
    if(/SH/.test(code)){
      return "HA";
    }else if(/SZ/.test(code)){
      return "SA";
    }
  };

  J_app.loading(true);

  var params = {};
  params['ptfTransId'] = data.tId;
  params['stkCode'] = data.code;
  params['ordSeq'] = data.seq;
  params['exchType'] = getExchType(data.code);

  J_app.ajax(J_app.api.withdrawOrder, params, function(data){

    J_app.loading(false);

    if(data.code === 0){
      J_app.alert('操作成功');
      handler.loadOrderList();
    } else{
      J_app.alert(data.message);
    }
  }, function(){
    J_app.loading(false);
    J_app.alert('请求超时');
  });
};

// 执行
$(function() {
  J_app.mustSign(function(){
    if(J_app.getCookie('status') === '2'){
      // 需要报名参赛
      $('body').append(template('trade/notJoin'));
    } else{
      handler.init();
    }
  });
});