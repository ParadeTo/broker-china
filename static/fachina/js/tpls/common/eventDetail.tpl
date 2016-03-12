{{if result}}
  <div class="index-event-info">
    <h2 class="season">第{{result.season}}季</h2>
    <span class="date">{{result.startTime | dateFormat:'M月d日'}}-{{result.endTime | dateFormat:'M月d日'}}</span>
    <div class="main">
      {{ if result.eventStatus === 0}}
        <div class="status">
          距离开赛<span>{{result.day}}</span>天
        </div>
        <div class="number">
          参赛投顾：<span>{{result.voteCount}}</span>人
        </div>
      {{else if result.eventStatus === 1}}
        <div class="status">
          距离结束<span>{{result.day}}</span>天
        </div>
        <div class="number">
          累计投票：<span>{{result.voteCount}}</span>
        </div>
      {{else}}
        <div class="status">已结束</div>
        <div class="number">
          累计投票：<span>{{result.voteCount}}</span>
        </div>
      {{/if}}
    </div>
  </div>
{{/if}}