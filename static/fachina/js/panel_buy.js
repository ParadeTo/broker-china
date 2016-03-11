/*
 * 模拟交易-买入
 * author： qinxingjun
 */

// 搜索股票
var stkComplete = {

  //输入参数
  inputChange : function(){

    $('#searchInput').on('keyup focus',function(){

      var txt = $(this).val();
      var $this = $(this);

      stkComplete.searchData(txt,$this);
    });

    //兼容IOS输入中文
    document.getElementById('searchInput').addEventListener('input', function(e){
      var txt = e.target.value;
      var $this = $(this);

      stkComplete.searchData(txt,$this);
    });
  },

  // 请求数据
  searchData : function(t,o){
    if(t.length > 0){
      if(t.length > 6 && o.data('code')){
        var params = {};
        params['cId'] = J_app.param.cId;
        params['condition'] = o.data('code').substr(0,6);
        params['flag'] = 1;
        params['pageSize'] = 6;
        J_app.ajax(J_app.api.searchMkt,params,stkComplete.displayStks);
      }else{
        var params = {};
        params['cId'] = J_app.param.cId;
        params['condition'] = t;
        params['flag'] = 1;
        params['pageSize'] = 6;
        J_app.ajax(J_app.api.searchMkt,params,stkComplete.displayStks);
        o.data('stk', '');
      }
    }else{
      $('#searchResult').hide();
      o.data('stk', '');
    }
  },

  //隐藏结果
  hideResult : function(){
    $('#searchResult').hide();
  },

  //显示结果
  displayStks : function(data){

    if(data.code === 0){
      var result = $(data.result.stks);
      var box = $('#searchResult');
      box.find('li').remove();

      if(result && result.length <= 0) {

        var html = '<li class="no-result">没有搜索到相关股票</li>';
        box.append(html);
      }else{
        $.each(result,function(i) {
          if(i < 3){
            var html = '<li data-code="' + result[i].id + '" data-status="' + result[i].status + '">'
                    + result[i].name + '&nbsp;&nbsp;'
                    + result[i].id
                    + stkComplete.stkStatus(result[i].status) + '</li>';
            box.append(html);
          }
        });
      }

      box.fadeIn();
      stkComplete.selectStk();
    }
  },

  //选择股票
  selectStk : function(){
    $('#searchResult li').on('click',function(){
      if($(this).hasClass('no-result')){
        return ;
      }else{
        var $this = $(this);
        var status = $this.data('status');
        var stk = $this.text();

        if(status === 5) {
          J_app.alert('未上市股票不能买入');
        }else if( status === 4){
          J_app.alert('退市股票不能买入');
        }else if( status === 3){
          J_app.alert('停牌股票不能买入');
        }else{
          $('#searchInput').data('code',$(this).data('code')).val(stk);
          stkComplete.hideResult();

          // 重新选择
          handler.keyWordsChange();
        }
      }
    });
  },

  //股票状态
  stkStatus : function(t){
    switch(t){
      case 5 :
        return '<em>未上市</em>';
      break;
      case 4 :
        return '<em>退市</em>';
      break;
      case 3 :
        return '<em>停牌</em>';
      break;
      default :
        return '';
    }
  }
};

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
  handler.quantityOper();
  stkComplete.inputChange();
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
    var code = $(this).data('id').substr(0,6);
    $('#searchInput').val(code).trigger('focus');
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

// 计算数量
handler.count = function(cash) {
  var price = parseFloat($('#stkPrice').val());
  if(cash && price && typeof cash === "number" && typeof price === "number" && cash>0 && price > 0){
      return Math.floor(cash/(100*price))*100;
    }else{
      return 0;
    }
};

// 计算可买股数
handler.ableQuantity = function() {
  $('#ableQuantity').html(handler.count(handler.cash));
};

// 仓位选择
handler.quantityOper = function() {
  $('#quantitySpace').on('click', 'li', function() {
    var cash = handler.cash/$(this).data('den');
    $('#stkQuantity').val(handler.count(cash));
  });
};

// 点击买入
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
      J_app.alert('请输入股票');
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
      title: '委托买单确认',
      main: template('panel/dialogBS', data),
      sure: handler.buySubmit
    };
    J_app.confirm(option);
  });
};

// 买入
handler.buySubmit = function() {

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
  params['ordBS'] = 'B';
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

// 将数组清0
handler.clearInput = function() {
  $('#searchInput').val('').data('code', '');
  handler.keyWordsChange();
};

$(function() {
  handler.init();
});