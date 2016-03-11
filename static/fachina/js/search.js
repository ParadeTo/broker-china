/**
 * 搜索结果
 * Created by ayou on 2016-03-09.
 */
var searchHandler = window.searchHandler || {};
searchHandler.lastId = 0;

// 搜索
searchHandler.search = function() {
  $("#search-more").hide();
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
  J_app.ajax(J_app.api.searchJoin, param, function(data) {
    $("#search-more").removeClass("locked");
    J_app.loading(false);
    var trHtml = "";
    if(data.code === 0) {
      trHtml = template('search/rankAdviser', data.result);
      $("#rankAdviser").append(trHtml);
      if(data.result.hasNext === 0) {
        $("#search-more").hide();
        $("#search-more").unbind("click");
      } else {
        $("#search-more").show();
      }
      searchHandler.lastId = data.result.readId;
    } else {
      J_app.alert(data.message);
    }
  }, function() {
    J_app.loading(false);
    J_app.alert("请求数据失败")
  });
};

// 点击获取更多
searchHandler.more = function() {
  $("#search-more").click(function() {
    var $this = $(this);
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');

    searchHandler.search();
  });
};

$(function() {
  searchHandler.search();
  searchHandler.more();
});