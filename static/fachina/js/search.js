/**
 * 搜索结果
 * Created by ayou on 2016-03-09.
 */
var searchHandler = window.searchHandler || {};
searchHandler.lastId = 0;
// 判断是否是第一次搜索，从其他页面跳转过来
searchHandler.keyword = "";

// 搜索
searchHandler.search = function(keyword) {
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
    J_app.alert("请求数据失败");
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

    searchHandler.search(searchHandler.keyword);
  });
};

// 绑定点击搜索事件，不刷新页面
searchHandler.searchBtnClick = function() {
  $("#search-btn").on("click", function() {
    // 获取关键词
    var  keyword = $("#search-keyword").val();
    // 检查关键词
    if (!keyword) {
      J_app.alert("请输入关键词");
      return ;
    }

    // 初始化状态
    $("#rankAdviser").html("");
    searchHandler.lastId = 0;
    $("#search-more").hide();

    searchHandler.keyword = keyword;
    searchHandler.search(keyword);
  });
}

$(function() {
  // 获取url中的关键词搜索，只执行一次
  var keyword = J_app.getUrlParam("keyword");
  searchHandler.keyword = keyword;
  $("#search-keyword").val(keyword);
  searchHandler.search(keyword);
  // 绑定事件
  searchHandler.more();
  searchHandler.searchBtnClick();
});