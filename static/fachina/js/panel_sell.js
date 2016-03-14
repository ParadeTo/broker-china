/*
 * 模拟交易-卖出
 * author： qinxingjun
 */

var handler = window.handler || {};

// 价格变换基数
handler.priceUnit = 0.01;

// 测试现金
handler.cash = 0;

// 刷新五档定时器
handler.timer = null;

// 五档跌停涨停
handler.limitdown = 0;
handler.limitup = 0;

// 初始化
handler.init = function() {

  // 委托查询
  handler.loadPtfDetail();
  handler.selectPtfStks();
  handler.priceOper();
  handler.clickSubmitBtn();
  handler.insistTouch();
};

// 加载持仓详情
handler.loadPtfDetail = function() {
  var params = {};

  params['cId'] = J_app.param.cId;

  J_app.ajax(J_app.api.ptfDetail, params, function(data){

    var listHtml;

    if(data.code === 0){
      if(data.result){

        var stks = data.result.stks;
        handler.cash = stks[stks.length-1].tBal;
        stks.pop();

        for(var i=0; i<stks.length; i++){
          if(stks[i].incBal > 0){
            stks[i]['yieldColor'] = 'text-red';
          } else if(stks[i].incBal < 0){
            stks[i]['yieldColor'] = 'text-green';
          } else {
            stks[i]['yieldColor'] = '';
          }
        }

        listHtml = template('panel/panelTake', { stks: stks});
      }
    } else{
      J_app.alert(data.message);
    }

    $('#ptfDetail').empty().append(listHtml);
  });
};

// 搜索条件改变，价格和数量清0
handler.keyWordsChange = function() {
  clearInterval(handler.timer);
  handler.getFiveBets();
  $('#stkPrice').val(0);
  $('#ableQuantity').html(0);

  handler.timer = setInterval(handler.getFiveBets, 10000);
};

// 选择持仓中的股票
handler.selectPtfStks = function() {

  $('#ptfDetail').on('click', 'tr', function() {
    var code = $(this).data('id').substr(0,6),
        name = $(this).data('name');

    $('#searchInput').val(code+name).data('code',$(this).data('id'));
    $('#ableQuantity').html($(this).data('aBal'));
    handler.getFiveBets();
  });
};

// 获取五档行情
handler.getFiveBets = function() {

  function color(d,b){
    if(d > b){
      return 'text-red';
    } else if(d < b){
      return 'text-green';
    } else {
      return 'text-gray';
    }
  }

  var params = {};
  params['cId'] = J_app.param.cId;
  params['assetId'] = $('#searchInput').data('code');

  J_app.ajax(J_app.api.fiveBets, params, function(data){
    if(data.code === 0){

      // 调价级别
      handler.priceUnit = data.result.priceUnit;

      // 涨停 跌停
      $('#priceFall').html(data.result.limitdown);
      $('#priceRise').html(data.result.limitup);
      handler.limitdown = data.result.limitdown;
      handler.limitup = data.result.limitup;

      $('#stkPrice').val(data.result.price);

      // 显示五档
      var ask = data.result.ask,
          bid = data.result.bid;

      var ulHtmls1 = [],
          ulHtmls2 = [];

      ulHtmls1.push('<ul class="panel-five-bets">');
      ulHtmls2.push('<ul class="panel-five-bets">');

      for(var i=0; i<5; i++){

        ulHtmls1.push('<li data-price="' + ask.price[i] + '">');
        ulHtmls1.push('<span>卖' + (5-i) + '</span>');
        ulHtmls1.push('<span class="' + color(ask.price[i], data.result.price) + '">' + ask.price[i] + '</span>');
        ulHtmls1.push('<span>' + ask.vol[i] + '</span></li>');

        ulHtmls2.push('<li data-price="' + bid.price[i] + '">');
        ulHtmls2.push('<span>买' + (i+1) + '</span>');
        ulHtmls2.push('<span class="' + color(bid.price[i], data.result.price) + '">' + bid.price[i] + '</span>');
        ulHtmls2.push('<span>' + bid.vol[i] + '</span></li>');
      }

      ulHtmls1.push('</ul>');
      ulHtmls1.push('</ul>');

      $('#fiveBetsBox').empty().append(ulHtmls1.join('') + ulHtmls2.join(''));

      // 执行选择五档
      handler.selectFiveBets();
    } else{
      J_app.alert(data.message);
    }
  });
};

// 选择五档
handler.selectFiveBets = function() {
  // 解除事件绑定
  $('#fiveBetsBox,#priceFall,#priceRise').unbind('click');

  // 选择五档
  $('#fiveBetsBox').on('click', 'li', function(){
    $('#stkPrice').val($(this).data('price'));
    handler.ableQuantity(); // 计算可买数量
  });

  //点击涨停，跌停
  $("#priceFall,#priceRise").on("click", function(){
    $('#stkPrice').val($(this).html());
    handler.ableQuantity(); // 计算可买数量
  });
};

// 价格修改
handler.priceOper = function() {
  $('#quantityForm').on('click', 'li', function(){
    var $this = $(this),
        input = $this.siblings('.input').find('input'),
        val = parseFloat(input.val()),
        limit = handler.priceUnit.toString().split('.')[1].length;

    // 增加
    if($this.data('type') === 'add'){
      val = (val + handler.priceUnit).toFixed(limit);
    }

    // 减少
    if($this.data('type') === 'reduce'){
      val = (val - handler.priceUnit).toFixed(limit);
    }


    if(parseFloat(val) > handler.limitup){
      val = handler.limitup;
    } else if(parseFloat(val) < handler.limitdown){
      val = handler.limitdown;
    }

    input.val(val);
    handler.ableQuantity(); // 计算可买数量
  });

  // 手动填写价格
  $('#stkPrice').on('blur', handler.ableQuantity);
};

// 模拟长按事件
handler.insistTouch = function() {

  var timer = null;

  $('#quantityForm li').on('touchstart mousedown', function(){
    var $this = $(this);
    timer = setInterval(function(){
      $this.trigger('click');
    },250);
  }).on('touchend mouseup', function(){
    clearInterval(timer);
  });
};

// 点击卖出
handler.clickSubmitBtn = function() {

  // 需要加入确认弹窗
  $('#submitBtn').on('click', function(){
    var data = {
      name : '平安银行',
      asset : $('#searchInput').data('code'),
      number : $('#stkQuantity').val(),
      price : $('#stkPrice').val()
    };

    if(!data.asset){
      J_app.alert('请选择股票');
      return false;
    }

    if(data.price === '0') {
      J_app.alert('请输入价格');
      return false;
    }

    if(!data.number){
      J_app.alert('请输入数量');
      return false;
    }

    var option = {
      title: '委托卖单确认',
      main: template('panel/dialogBS', data),
      sure: handler.sellSubmit
    };
    J_app.confirm(option);
  });
};

// 卖出
handler.sellSubmit = function() {

  //交易市场
  function getExchType(code){
    if(/SH/.test(code)){
      return "HA";
    }else if(/SZ/.test(code)){
      return "SA";
    }
  };

  // 需要加入确认弹窗
  var params = {};

  params['cId'] = J_app.param.cId;
  params['stkCode'] = $('#searchInput').data('code').substr(0,6);
  params['ordQty'] = $('#stkQuantity').val();
  params['ordPrc'] = $('#stkPrice').val();
  params['ordBS'] = 'S';
  params['ordProp'] = 'L';
  params['exchType'] = getExchType($('#searchInput').data('code'));

  console.log(params['stkCode']);

  J_app.ajax(J_app.api.simuOrder, params, function(data){
    if(data.code === 0){
      handler.clearInput();
      handler.loadPtfDetail();
    } else{
      J_app.alert(data.message);
    }
  });
};

// 将数据清零
handler.clearInput = function() {
  $('#searchInput').val('').data('code', '');
  handler.keyWordsChange();
};

// 执行
$(function() {
  handler.init();
});