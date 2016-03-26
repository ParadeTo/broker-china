/**
 * 搜索结果
 * Created by ayou on 2016-03-09.
 */
var handler = window.handler || {};
handler.lastId = 0;
// 判断是否是第一次搜索，从其他页面跳转过来
handler.keyword = "";

// 搜索
handler.search = function(keyword) {
  // 加载动画
  J_app.loading(true);
  // 请求数据
  var param = {};
  param['keyword'] = keyword;
  param['count'] = 10;
  param['readId'] = handler.lastId;
  J_app.ajax(J_app.api.searchJoin, param, function(data) {
    $("#search-more").removeClass("locked");
    J_app.loading(false);
    var trHtml = "";
    if(data.code === 0) {
      trHtml = template('search/rankAdviser', J_app.tmpData(data.result));
      $("#rankAdviser").append(trHtml);
      if(data.result.hasNext === 0) {
        $("#search-more").hide();
        $("#search-more").unbind("click");
      } else {
        $("#search-more").show();
      }

      // 数据为空
      if($('#rankAdviser').children().length === 0) {
        $('#listBox').empty().append(template('common/noData', {message:'没有搜到相关数据'}));
      }
      handler.lastId = data.result.readId;
    } else {
      $("#rankAdviser").append(template('common/errorTable5', data));
    }
  }, function() {
    J_app.loading(false);
    $("#rankAdviser").append(template('common/errorTable5', {message:'请求超时！'}));
  });
};

// 点击获取更多
handler.more = function() {
  $("#search-more").click(function() {
    var $this = $(this);
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');

    handler.search(handler.keyword);
  });
};

// 绑定点击搜索事件，不刷新页面
handler.searchBtnClick = function() {
  $("#searchBtn").on("click", function() {
    // 获取关键词
    var  keyword = $("#searchKeyword").val();
    // 检查关键词
    if (!keyword) {
      J_app.alert("请输入投顾/机构查询");
      return ;
    }

    // 初始化状态
    $("#rankAdviser").html("");
    handler.lastId = 0;
    $("#search-more").hide();

    handler.keyword = keyword;
    handler.search(keyword);
  });
};

$(function() {
  // 获取url中的关键词搜索，只执行一次
  var keyword = J_app.getUrlParam("keyword");
  handler.keyword = keyword;
  $("#searchKeyword").val(keyword);
  handler.search(keyword);
  // 绑定事件
  handler.more();
  handler.searchBtnClick();
});