{{each datas as item}}
<tr data-join="{{item.joinId}}">
  <td>
    <i class="icon-rank rank-{{item.rank}}"><em></em>{{item.rank}}</i>
  </td>
  <td>
    <div class="user-info-box">
      <div class="user-img">
        <img src="{{item.uImg}}">
      </div>
      <dl class="user-info">
        <dt>{{item.uName | limit:3}}</dt>
      </dl>
    </div>
  </td>
  <td>
    <span class="text-danger">{{item.yield | rate}}</span>
  </td>
  <td>
    <div class="index-td-btn">
      <a href="./home.html?id={{item.joinId}}" class="btn btn-white">查看</a>
    </div>
  </td>
  <td>
    <div class="index-td-btn">
      <span class="total-number">{{item.favCount}}</span>
      {{if item.isFav === 1}}
        <a href="javascript:;" class="btn btn-gray disabled">已关注</a>
      {{else}}
        <a data-id="{{item.joinId}}" href="javascript:;" class="btn btn-red J-fav">关注</a>
      {{/if}}
    </div>
  </td>
</tr>
{{/each}}