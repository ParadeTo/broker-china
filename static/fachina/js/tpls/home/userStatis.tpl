<ul class="ui-row">
  <li class="ui-col">
    <span class="title">综合排名</span>
    <span class="data">{{ result.rank | isNull }}</span>
  </li>
  <li class="ui-col">
    <span class="title" >赛季收益率</span>
    <span class="data {{ result.yield | color }}">{{ result.yield | rate:true }}<em class="icon-symbol-per">%</em></span>
  </li>
  <li class="ui-col">
    <span class="title">得票数</span>
    <span class="data">{{ result.voteCount | isNull }}</span>
  </li>
</ul>