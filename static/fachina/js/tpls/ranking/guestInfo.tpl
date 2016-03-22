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
      <a href="javascript:J_app.joinEventAction();" class="btn btn-red btn-fixed-middle J-touch">我要参赛</a>
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
        <a data-id="{{ result.joinId }}" href="javascript:;" class="btn btn-orange btn-fixed-middle J-touch J-invite-alone">转发拉票</a>
      {{else}}
        {{ if result.remainVote === 0}}
          <a data-id="{{ result.joinId }}" data-name="{{result.uName}}" data-img="{{result.uImg}}" href="javascript:;" class="btn btn-orange btn-fixed-middle J-touch J-invite-guest">帮TA拉票</a>
        {{ else if result.remainVote === 0 }}
          <a data-id="{{ result.joinId }}" href="javascript:;" class="btn btn-red btn-fixed-middle J-touch J-vote-guest">再投1票</a>
        {{ else }}
          <a data-id="{{ result.joinId }}" href="javascript:;" class="btn btn-red btn-fixed-middle J-touch J-vote-guest">投票</a>
        {{ /if }}
      {{/if}}
      </div>
    </div>
    {{/if}}
  </div>
</div>