<div class="ranking-action-wrap">
  <div class="ui-container bg-white ranking-action-box clearfix">
    <div class="ranking-user-info">
      <div class="ui-avatar">
        {{if result.uImg}}
        <img src="{{result.uImg}}">
        {{/if}}
      </div>
      <div class="name">
        {{result.uName}}
      </div>
      <div class="org">
        {{result.adviserOrg}}
      </div>
    </div>
    {{if result.joinStatus===0}}
    <div class="ranking-btn-box center">
      <a href="./enroll_entry.html" class="btn btn-red btn-fixed-middle">我要参赛</a>
      <a href="./rules.html" class="ranking-to-rules">查看规则</a>
    </div>
    {{else if result.joinStatus===1}}
    <div class="ranking-btn-box">
      <ul class="ui-row">
        <li class="ui-col">
          <span class="title">综合排名</span>
          <span class="data">{{ result.rank | isNull }}</span>
        </li>
        <li class="ui-col">
          <span class="title">赛季收益率</span>
          <span class="data {{ result.yield | color }}">{{ result.yield | rate:true }}<em class="icon-symbol-per">%</em></span>
        </li>
        <li class="ui-col">
          <span class="title">得票数</span>
          <span class="data">{{ result.voteCount | isNull }}</span>
        </li>
      </ul>
      <div class="center">
      <a href="javascript:;" class="btn btn-gray btn-fixed-middle disabled">审核中</a>
      </div>
    </div>
    {{else}}
    <div class="ranking-btn-box">
      <ul class="ui-row">
        <li class="ui-col">
          <span class="title">综合排名</span>
          <span class="data">{{ result.rank | isNull }}</span>
        </li>
        <li class="ui-col">
          <span class="title">赛季收益率</span>
          <span class="data {{ result.yield | color }}">{{ result.yield | rate:true }}<em class="icon-symbol-per">%</em></span>
        </li>
        <li class="ui-col">
          <span class="title">得票数</span>
          <span class="data">{{ result.voteCount | isNull }}</span>
        </li>
      </ul>

      <div class="center">
      {{if result.identity === 'M'}}
        <href="javascript:;" class="btn btn-orange btn-fixed-middle J-invite">转发拉票</a>
      {{else}}
        <href="javascript:;" class="btn btn-red btn-fixed-middle J-vote">投票</a>
      {{/if}}
      </div>
    </div>
    {{/if}}
  </div>
</div>