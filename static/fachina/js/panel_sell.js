/*
 * 模拟交易-卖出
 * author： qinxingjun
 */

var handler = window.handler || {};

// 价格变换基数
handler.priceUnit = 0.01;

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
  handler.quantityOper();
};

// 加载持仓详情
handler.loadPtfDetail = function() {

  J_app.loading(true);

  J_app.ajax(J_app.api.ptfDetail, {}, function(data){
    J_app.loading(false);

    var trHtml;
    if(data.code === 0){
      if(data.result){
        var stks = data.result.stks;
        stks.pop();
        trHtml = template('panel/panelTake', { stks: stks});
      }
    } else{
      J_app.alert(data.message);
    }

    $('#ptfDetail').empty().append(trHtml);
  }, function(){
    J_app.loading(false);
    J_app.alert('请求超时！');
  });
};

// 选择持仓中的股票
handler.selectPtfStks = function() {

  $('#ptfDetail').on('click', 'tr', function() {
    clearInterval(handler.timer);

    var code = $(this).data('id'),
        name = $(this).data('name');

    $('#searchInput').val(name + ' ' + code).data('code',code).data('name',name);
    $('#ableQuantity').html($(this).data('abal'));
    $('#stkQuantity').val(0);
    $('#stkPrice').val(0).data('status','N');
    handler.getFiveBets();
    handler.timer = setInterval(handler.getFiveBets, 10000);
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

      if($('#stkPrice').data('status') !== 'Y'){
        $('#stkPrice').val(data.result.price).data('status', 'Y');
      }

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
  });

  //点击涨停，跌停
  $("#priceFall,#priceRise").on("click", function(){
    $('#stkPrice').val($(this).html());
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
  });
};

// 仓位选择
handler.quantityOper = function() {
  $('#quantitySpace').on('click', 'li', function() {
    var tBal = parseInt($('#ableQuantity').html()),
        position = $(this).data('den'),
        ableBal = 0;
    ableBal = Math.floor(tBal/(100*position))*100;
    $('#stkQuantity').val(ableBal);
  });

  //手动输入股数
  $('#stkQuantity').on('blur', function(){
    var abalNumber = parseInt($('#ableQuantity').html());
    var setNumber = parseInt($(this).val());

    if(setNumber > abalNumber){
      J_app.alert('当前最多可卖' + abalNumber + '股');
      $(this).val(abalNumber);
    }
  });
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
      name : $('#searchInput').data('name'),
      asset : $('#searchInput').data('code'),
      number : $.trim($('#stkQuantity').val()),
      tPrice : $.trim($('#stkPrice').val())
    };

    if(!data.asset){
      J_app.alert('请选择股票');
      return false;
    }

    if(data.tPrice === '0') {
      J_app.alert('请输入价格');
      return false;
    }

    if(data.number === '0' || data.number === ''){
      J_app.alert('请输入数量');
      return false;
    }

    if(parseInt(data.number) < 0){
      J_app.alert('数量不能为负数');
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

  params['stkCode'] = $('#searchInput').data('code').substr(0,6);
  params['ordQty'] = $('#stkQuantity').val();
  params['ordPrc'] = $('#stkPrice').val();
  params['ordBS'] = 'S';
  params['ordProp'] = 'L';
  params['exchType'] = getExchType($('#searchInput').data('code'));

  J_app.ajax(J_app.api.simuOrder, params, function(data){
    if(data.code === 0){
      handler.loadPtfDetail();
      $('#searchInput').val('').data('code', '');
      $('#stkQuantity').val(0);
      clearInterval(handler.timer);
    } else{
      J_app.alert(data.message);
    }
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
        handler.init();
      }
    }
  });
});