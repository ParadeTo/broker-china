<ul class="ui-row">
  <li class="ui-col">
    <span>综合排名</span>
    <span>{{ result.rank | isNull }}</span>
  </li>
  <li class="ui-col">
    <span>赛季收益率</span>
    <span>{{ result.yield | rate }}</span>
  </li>
  <li class="ui-col">
    <span>得票数</span>
    <span>{{ result.voteCount | isNull }}</span>
  </li>
</ul>