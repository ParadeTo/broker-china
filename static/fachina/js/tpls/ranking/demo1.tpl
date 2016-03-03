{{each datas as item}}
<tr data-join="{{item.joinId}}">
  <td>
    <i class="icon-rank rank-{{item.rank}}"><em></em>{{item.rank}}</i>
  </td>
  <td>
    {{item.adviserOrg}}
  </td>
  <td>
    <span class="text-danger">{{item.yield | rate}}</span>
  </td>
  <td>
    {{item.joinNum}}
  </td>
  <td>
    <div class="index-td-btn">
      <span class="total-number">{{item.voteCount}}</span>
      <a href="javascript:;" class="btn btn-red">拉票</a>
    </div>
  </td>
</tr>
{{/each}}