/*
 * 模拟交易-买入
 * author： qinxingjun
 */

// 搜索股票
var stkComplete = {

  timer: null,

  //输入参数
  inputChange : function(){

    $('#searchInput').on('keyup',function(){
      clearTimeout(stkComplete.timer);

      var txt = $(this).val();
      var $this = $(this);

      stkComplete.timer = setTimeout(function(){
        stkComplete.searchData(txt,$this);
      },300);
    });

    //兼容IOS输入中文
    document.getElementById('searchInput').addEventListener('input', function(e){
      clearTimeout(stkComplete.timer);

      var txt = e.target.value;
      var $this = $(this);

      stkComplete.timer = setTimeout(function(){
        stkComplete.searchData(txt,$this);
      },300);
    });
  },

  // 请求数据
  searchData : function(t,o){
    if(t.length > 0){
      if(t.length > 6 && o.data('code')){
        var params = {};
        params['condition'] = o.data('code').substr(0,6);
        params['flag'] = 1;
        params['pageSize'] = 6;
        J_app.ajax(J_app.api.searchMkt,params,stkComplete.displayStks);
      }else{
        var params = {};
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
            var html = '<li data-code="' + result[i].id + '" data-status="' + result[i].status + '" data-name="' + result[i].name + '">'
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
          $('#searchInput').data('code',$this.data('code')).data('name',$this.data('name')).val(stk);
          stkComplete.hideResult();

          // 重新选择
          handler.setKeywords();
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

// 现金
handler.cash = 0;

// 刷新五档定时器
handler.timer = null;

// 五档跌停涨停
handler.limitdown = 0;
handler.limitup = 0;

// 初始化
handler.init = function() {

  // 屏蔽微信分享
  J_app.shareByWeixin(true);

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

  J_app.loading(true);

  J_app.ajax(J_app.api.ptfDetail, {}, function(data){

    J_app.loading(false);

    var trHtml;
    if(data.code === 0){
      if(data.result){
        var stks = data.result.stks;

        // 取得现金
        handler.cash = data.result.avlBal;
        stks.pop();
        trHtml = template('panel/panelTake', { stks: stks});
      }
    } else{
      $('body').append(template('trade/notStart'), data);
    }

    $('#ptfDetail').empty().append(trHtml);
  }, function(){
    J_app.loading(false);
    J_app.alert('请求超时！');
  });
};

// 搜索条件改变，价格和数量清零
handler.setKeywords = function() {
  clearInterval(handler.timer);
  handler.getFiveBets();
  $('#stkQuantity').val(0);
  $('#ableQuantity').html(0);
  $('#stkPrice').val(0).data('status', 'N');
  handler.timer = setInterval(handler.getFiveBets, 10000);
};

// 选择持仓中的股票
handler.selectPtfStks = function() {
  $('#ptfDetail').on('click', 'tr', function() {
    var code = $(this).data('id'),
        name = $(this).data('name');
    $('#searchInput').val(name + ' ' + code).data('code', code).data('name', name);
    handler.setKeywords();
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

      handler.ableQuantity();

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
      console.log(data.message);
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

    // 计算可买数量
    handler.ableQuantity();
  });

  //点击涨停，跌停
  $("#priceFall,#priceRise").on("click", function(){
    $('#stkPrice').val($(this).html());

    // 计算可买数量
    handler.ableQuantity();
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

    // 计算可买数量
    handler.ableQuantity();
  });

  // 手动填写价格
  $('#stkPrice').on('blur', handler.ableQuantity);
};

// 模拟长按事件
handler.insistTouch = function() {

  var timer = null;
  $('#quantityForm li').on('touchstart mousedown', function(e){
    e.preventDefault();
    var $this = $(this);
    $this.trigger('click');
    timer = setInterval(function(){
      $this.trigger('click');
    },200);
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

  //手动输入股数
  $('#stkQuantity').on('blur', function(){
    var abalNumber = parseInt($('#ableQuantity').html());
    var setNumber = parseInt($(this).val());

    if(setNumber > abalNumber){
      J_app.alert('当前最多可买' + abalNumber + '股');
      $(this).val(abalNumber);
    }
  });
};

// 点击买入
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
      J_app.alert('请输入股票');
      return false;
    }

    if(data.tPrice === '0') {
      J_app.alert('请输入价格');
      return false;
    }

    if(data.number === '0' || data.number === '' || parseFloat(data.number) === 0){
      J_app.alert('请输入数量');
      return false;
    }

    if(parseInt(data.number) < 0){
      J_app.alert('数量不能为负数');
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

  J_app.loading(true);

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
  params['ordBS'] = 'B';
  params['ordProp'] = 'L';
  params['exchType'] = getExchType($('#searchInput').data('code'));

  J_app.ajax(J_app.api.simuOrder, params, function(data){

    J_app.loading(false);

    if(data.code === 0){
      handler.resetInput();
      handler.loadPtfDetail();
    } else{
      J_app.alert(data.message);
    }
  }, function(){
    J_app.loading(false);
    J_app.alert('请求超时！');
  });
};

// 将数据清零
handler.resetInput = function() {
  handler.setKeywords();
  $('#searchInput').val('').data('code', '');
};

// 执行
$(function() {
  J_app.userInfoInit(function(){

    // 没登录将进行登录
    if(!J_app.getCookie('id')){
      J_app.navControl('./trade.html', 'trade');
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