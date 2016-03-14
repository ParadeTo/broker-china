<div class="ui-container bg-white ranking-action-box clearfix">
  <div class="ranking-user-info">
    <div class="ui-avatar">
      {{if result.uImg}}
      <img src="{{result.uImg}}">
      {{/if}}
    </div>
    <div>
      {{result.uName}}
    </div>
  </div>
  {{if result.joinStatus===0}}
  <div class="ranking-btn-box">
    <button class="btn btn-red">我要参赛</button>
    <a href="#">查看规则</a>
  </div>
  {{else if result.joinStatus===1}}
  <div class="ranking-btn-box">
    <ul class="ui-row">
      <li class="ui-col">
        <span>综合排名</span>
        <span>{{ result.rank | isNull }}</span>
      </li>
      <li class="ui-col">
        <span>赛季收益率</span>
        <span>{{ result.uName | isNull }}</span>
      </li>
      <li class="ui-col">
        <span>得票数</span>
        <span>{{ result.voteCount | isNull }}</span>
      </li>
    </ul>
    <button class="btn btn-red disabled">审核中</button>
  </div>
  {{else}}
  <div class="ranking-btn-box">
    <ul class="ui-row">
      <li class="ui-col">
        <span>综合排名</span>
        <span>{{ result.rank | isNull }}</span>
      </li>
      <li class="ui-col">
        <span>赛季收益率</span>
        <span>{{ result.uName | isNull }}</span>
      </li>
      <li class="ui-col">
        <span>得票数</span>
        <span>{{ result.voteCount | isNull }}</span>
      </li>
    </ul>

    {{if result.identity === 'M'}}
      <button class="btn btn-red">转发拉票</button>
    {{else}}
      <button class="btn btn-red">投票</button>
    {{/if}}
  </div>
  {{/if}}
</div>