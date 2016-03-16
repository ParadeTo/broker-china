/**
 * 观点列表
 * Created by ayou on 2016-03-01.
 */

var viewpointHandler = window.viewpointHandler || {};
viewpointHandler.lastViewpointId = 0;

// 处理时间和分享链接
function dealData(data) {
  var _data = data;
  for(var i=0;i<data.length;i++) {
    _data[i].viewpointTs = J_app.timeDifference(data[i].viewpointTs);
    if(_data[i].targetId){
      _data[i].shareUrl = _data[i].shareUrl + "&joinId=" + _data[i].targetId;
    }
  }
  return _data;
}

// 获取观点列表
viewpointHandler.getList = function() {
  // 加载动画
  J_app.loading(true);

  var params = {};
  params['type'] = "L";
  params['count'] = 10;
  params['readId'] = viewpointHandler.lastViewpointId;

  J_app.ajax(J_app.api.noteList, params, function(data) {
    $('#viewpoint-more').removeClass("locked");
    J_app.loading(false);
    var listHtml;
    if(data.code === 0) {
      if(data.result.data.length>0) {
        var list = dealData(data.result.data);
        viewpointHandler.lastViewpointId = list[list.length-1].viewpointId;
        listHtml = template('viewpoint/viewpointList', {'list':list});
        $('.page').append(listHtml);
        // 显示点击查看更多
        $('#viewpoint-more').html("点击查看更多").show();
      } else { // 没有更多数据
        // 隐藏加载图片
        $('#viewpoint-more').html("").show();
        // 解绑点击事件
        $('#viewpoint-more').unbind("click");
      }
    }else{
      J_app.alert(data.message);
    }
  },function(){
    $('#viewpoint-more').removeClass("locked");
    J_app.alert("请求数据失败")
  });
};

// 点击查看更多
viewpointHandler.getMore = function() {
  $('#viewpoint-more').click(function() {
    var $this = $(this);
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');

    // 得到更多观点
    viewpointHandler.getList();

  });
};

// 初始化
viewpointHandler.init = function() {
  // 清空观点列表
  $('.page').html("")
  // 数据加载前点击查看更多不显示
  $('#viewpoint-more').html("").show();
  // 获取列表
  viewpointHandler.getList();
};

$(function() {
  viewpointHandler.init();
  viewpointHandler.getMore();
});