/**
 * 搜索结果
 * Created by ayou on 2016-03-09.
 */
var searchHandler = window.searchHandler || {};
searchHandler.lastId = 0;

// 搜索
searchHandler.search = function() {
  // 得到url参数
  var keyword = J_app.getUrlParam("keyword");
  // 将关键词赋值为input
  $("#search-keyword").val(keyword);
  // 加载动画
  J_app.loading(true);
  // 请求数据
  var param = {};
  param['keyword'] = keyword;
  param['count'] = 10;
  param['readId'] = searchHandler.lastId;
  J_app.ajax(J_app.api.searchJoin, param, function(data){
    console.log(data);
    J_app.loading(false);
    var trHtml = "";
    if(data.code === 0) {
      //alert(data.result.datas);
      if(!data.result.datas) {
        $("#search-more").html("没有更多数据").show();
      }
      trHtml = template('search/rankAdviser', data.result);
      $("#rankAdviser").append(trHtml);
    } else {
      J_app.alert(data.message);
    }
  }, function(){
    J_app.loading(false);
    J_app.alert("请求数据失败")
  });
}

$(function() {
  searchHandler.search();
});