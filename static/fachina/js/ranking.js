/*
 * 榜单
 * author： qinxingjun
 */

var handler = window.handler || {};

// 初始化
handler.init = function() {

  // 赛事直播动画
  $('#eventRadio').muSlideUp({time:3000});
  $('#rankTab').muTabs($('#rankContent'),handler.loadRankList);

  // 请求广告
  J_app.adverst(2202);

  // 请求观点列表
  handler.loadEventDetail();
  handler.loadEventRadio();
  handler.loadRankList();
  //handler.voteActive();
  //handler.joinActive();
  handler.inviteActive();
  handler.loadListMore();
  handler.loadUserInfo();
  handler.swiperVertical();
  handler.loadInviteUserInfo();
};

// 获取赛事信息
handler.loadEventDetail = function() {
  var params = {};

  J_app.ajax(J_app.api.eventDetail, params, function(data){

    var detailHtml;

    if(data.code === 0){
      detailHtml = template('common/eventDetail', data);
    } else{
      detailHtml = template('common/error', data);
    }

    $('#indexBanner').append(detailHtml);
  });
};

// 获取赛事直播
handler.loadEventRadio = function() {

  var params = {};

  params['type'] = 'C';
  params['count'] = 10;
  params['readId'] = 0;

  J_app.ajax(J_app.api.noteList, params, function(data){

    var listData = {},
        listHtml;

    listData['urlHost'] = J_app.host;

    if(data.code === 0){
      if(data.result){
        $.extend(listData, data.result);
      }
      listHtml = template('index/eventRadio', listData);
    } else{
      listHtml = template('common/error', data);
    }

    $('#eventRadio').empty().append(listHtml);
  },function(){
    $('#eventRadio').empty().append(template('common/loadFail'));
  });
};

// 获取用户信息
handler.loadUserInfo = function() {

  if(J_app.param.cId){
    J_app.ajax(J_app.api.joinDetail, {}, function(data){
      if(data.code === 0){
        if(data.result.joinStatus === 0){
        // 如果没参赛，显示报名按钮
          $('#swiperMain').append(template('ranking/enrollBtn'));
        } else{
          $('#swiperMain').append(template('ranking/userInfo', data));
        }
      } else{
        console.log(data.message);
      }
    });
  }
};

// 获取分享用户的信息
handler.loadInviteUserInfo = function() {

  var joinId = J_app.getUrlParam('joinId');

  if(joinId) {
    var params = {};
    params['joinId'] = joinId;
    J_app.ajax(J_app.api.joinDetail, params, function(data){
      if(data.code === 0){
        $('#swiperMain').append(template('ranking/userInfo', data));
      } else{
        console.log(data.message);
      }
    });
  };
};

// 获取榜单
handler.loadRankList = function(obj,readId,more) {

  var type = obj ? obj.data('type') : 'A',
      readId = readId ? readId : 0,
      params = {},
      tplName,
      viewId;

  if(type === 'A'){
    tplName = 'rankAdviser';
    viewId = 'rankAdviser';
  } else if(type === 'O'){
    tplName = 'rankOrg';
    viewId = 'rankOrg';
  } else{
    tplName = 'rankElite';
    viewId = 'rankElite';
  };

  params['type'] = type;
  params['count'] = 10;
  params['readId'] = readId;

  J_app.ajax(J_app.api.joinList, params, function(data){

    var trHtml;

    if(data.code === 0){
      trHtml = template('ranking/' + tplName, data.result);

      if(data.result.hasNext === 1){
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').show();
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').data('readId',data.result.readId);
      } else{
        $('#' + viewId).closest('.index-ranking-content').find('.ui-more').hide();
      }
    } else{
      trHtml = template('common/error', data);
    }

    if(more){
      $('#' + viewId).append(trHtml);
    } else{
      $('#' + viewId).empty().append(trHtml);
    }
  }, function(){
    $('#' + viewId).empty().append(template('common/loadFail'));
  });
};

// 加载更多
handler.loadListMore = function() {
  $(document).on('click', '.ui-more', function(){
    var readId = $(this).data('readId');

    handler.loadRankList($(this), readId, true);
  });
};

// 我要参赛
//handler.joinActive = function() {
//
//  $('#joinEvent').on('click', function(){
//    J_app.checkSign(function(){
//      window.location.href = './enroll_entry.html';
//    })
//  });
//};

// 转发邀请
handler.inviteActive = function() {
  $('#inviteEvent').on('click', function(){
    J_app.checkSign(function(){
      console.log('弹出分享提示');
    })
  });
};

// 投票
//handler.voteActive = function() {
//
//  $(document).on('click', '.J-vote', function() {
//
//    var _this = $(this);
//
//    J_app.checkSign(function(){
//
//      var numberBox = _this.parent().find('.total-number'),
//        number = parseInt(numberBox.html()),
//        params = {};
//
//      if(_this.hasClass('J-locked')){
//        return;
//      }
//      _this.addClass('J-locked');
//
//      params['joinId'] = _this.data('id');
//
//      J_app.ajax(J_app.api.vote, params, function(data){
//
//        _this.removeClass('J-locked');
//
//        if(data.code === 0){
//
//          J_app.alert('投票成功！');
//
//          numberBox.html(++number);
//
//          if(data.result.voteCount === 1){
//            _this.html('再投一票');
//          } else{
//            _this.removeClass('J-vote').addClass('J-vote-share').html('帮TA拉票');
//          }
//        } else{
//          J_app.alert(data.message);
//        }
//      },function(){
//        J_app.alert('请求失败！');
//        _this.removeClass('J-locked');
//      });
//    });
//  });
//};

// 拉票
handler.voteShareActive = function() {

  $(document).on('click', '.J-vote-share', function(){
    // 修改微信分享地址；

    // 弹出分享提示
  });
};

//主屏区向上翻滚
handler.swiperVertical = function() {
  // 滑动切换效果
 // function addSwiping() {
    var options = {
        direction: 'vertical',
        loop: true,
        pagination: '#swiperCtrls',
        nextButton: '#swiperNext',
        prevButton: '#swiperPrev',
        paginationClickable: false,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: 5000,
        autoplayDisableOnInteraction: false
      },
    swiperVer = new Swiper('#swiperBox', options);
 // }
  //addSwiping();
};

$(function() {

  ///*测试登录代码*/
  //if(!$.cookie("fachinaId")){
  //  var params = {};
  //  params['certType'] = '0';
  //  params['certCode'] = '13402810264';
  //  params['pwd'] = '666666';
  //
  //  J_app.ajax(J_app.api.login, params, function(data){
  //
  //    if(data.code === 0){
  //      $.cookie("fachinaId", data.result.cId, {expires:365,path:'/'});
  //      console.log('登录成功！');
  //    } else{
  //      J_app.alert(data.message);
  //    }
  //  });
  //}

  handler.init();
});