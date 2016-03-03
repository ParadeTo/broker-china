/**
 * 观点列表
 * Created by ayou on 2016-03-01.
 */

var viewpointHandler = window.viewpointHandler || {};
viewpointHandler.lastViewpointId = 0;

// 处理时间
function dealTime(data) {
  var _data = data;
  for(var i=0;i<data.length;i++) {
    _data[i].viewpointTs = J_app.timeDifference(data[i].viewpointTs);
  }
  return _data;
}

// 获取观点列表
viewpointHandler.getList = function() {
  var params = {};
  params['type'] = "L";
  params['count'] = 10;
  params['readId'] = viewpointHandler.lastViewpointId;

  J_app.ajax(J_app.api.noteList, params, function(data) {
    var listHtml;
    console.log(data);
    if(data.code === 0) {
      if(data.result.data.length>0) {
        var list = dealTime(data.result.data);
        viewpointHandler.lastViewpointId = list[list.length-1].viewpointId;
        listHtml = template('viewpoint/viewpointList', {'list':list});
        $('.page').append(listHtml);
        // 隐藏加载图片
        $('#viewpoint-more').html("点击查看更多").removeClass('hide');
        $('#viewpoint-loading').addClass('hide');
      } else { // 没有更多数据
        // 隐藏加载图片
        $('#viewpoint-more').html("没有更多观点").removeClass('hide');
        $('#viewpoint-loading').addClass('hide');
        // 解绑点击事件
        $('#viewpoint-more').unbind("click");
      }
    }else{
      J_app.alert(data.message);
    }
  },function(){
    J_app.alert("请求失败！")
  });
};

// 点击查看更多
viewpointHandler.getMore = function() {
  $('#viewpoint-more').click(function() {
    // 显示加载图片
    $('#viewpoint-more').addClass('hide');
    $('#viewpoint-loading').removeClass('hide');
    // 得到更多观点
    viewpointHandler.getList();
  });
};

// 初始化
viewpointHandler.init = function() {
  // 清空观点列表
  $('.page').html("")
  // 获取列表
  viewpointHandler.getList();
};

$(function() {
  viewpointHandler.init();
  viewpointHandler.getMore();
});