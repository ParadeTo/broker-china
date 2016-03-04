<ul class="ui-row">
  <li class="ui-col">
    <dl>
      <dt>综合排名</dt>
      <dd>{{ result.rank | isNull }}</dd>
    </dl>
  </li>
  <li class="ui-col">
    <dl>
      <dt>赛季收益率</dt>
      <dd>{{ result.yield | isNull }}</dd>
    </dl>
  </li>
  <li class="ui-col">
    <dl>
      <dt>得票数</dt>
      <dd>{{ result.voteCount | isNull }}</dd>
    </dl>
  </li>
</ul>