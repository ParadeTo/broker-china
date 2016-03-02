/**
 * 观点列表
 * Created by ayou on 2016-03-01.
 */

var viewpointHandler = window.viewpointHandler || {};
viewpointHandler.lastViewpointId = 0;

// 获取观点列表
viewpointHandler.getList = function() {
  var params = {};
  params['type'] = "L";
  params['count'] = 10;
  params['readId'] = viewpointHandler.lastViewpointId;

  J_app.ajax(J_app.api.noteList, params, function(data) {
    console.log(data);
    var listHtml;
    if(data.code === 0) {
      listHtml = template('index/viewpointList', data.result);
      $('.page').html("").append(listHtml);
    }else{
      J_app.alert(data.message);
    }
  });
}

// 初始化
viewpointHandler.init = function() {
  // 清空观点列表
  $('.page').html("")
  // 获取列表
  viewpointHandler.getList();
};

$(function() {
  viewpointHandler.init();
});