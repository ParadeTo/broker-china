{{each datas as item}}
<tr>
  <td>
    <i class="icon-rank"><em></em>{{item.rank}}</i>
  </td>
  <td>
    <div class="user-info-box">
      <div class="user-img">
        <img src="{{item.uImg}}">
      </div>
      <dl class="user-info">
        <dt>{{item.uName | limit:3}}</dt>
        <dd>
        {{if item.adviserOrg}}
          {{item.adviserOrg}}
        {{/if}}
        </dd>
      </dl>
    </div>
  </td>
  <td>
    <span class="text-danger">{{item.yield | rate}}</span>
  </td>
  <td>
    <div class="index-td-btn">
      {{if userStatus === '1'}}
      <a href="./register.html" class="btn btn-white">查看</a>
      {{else}}
      <a href="./ptfshare/index.html?ptfId={{item.ptfId}}" class="btn btn-white">查看</a>
      {{/if}}
    </div>
  </td>
  <td>
    <div class="index-td-btn">
      <span class="total-number">{{item.voteCount}}</span>
      {{if remainVote === 0}}
        <a data-id="{{item.joinId}}" href="javascript:;" class="btn btn-orange btn-fixed-small J-vote-share">帮TA拉票</a>
      {{else}}
        {{if item.isVote === 1}}
          <a data-id="{{item.joinId}}" href="javascript:;" class="btn btn-red btn-fixed-small J-vote">再投1票</a>
        {{else}}
          <a data-id="{{item.joinId}}" href="javascript:;" class="btn btn-red btn-fixed-small J-vote">投票</a>
        {{/if}}
      {{/if}}
    </div>
  </td>
</tr>
{{/each}}