<div class="ui-row">
  <div class="ui-col">
    <dl>
      <dt>总资产</dt>
      <dd id="totalAssets" class="text-black"><em class="icon-symbol-rmb">￥</em>{{ result.mktVal | money }}</dd>
    </dl>
    <dl>
      <dt>可用资产</dt>
      <dd id="ableAssets" class="text-black"><em class="icon-symbol-rmb">￥</em>{{ result.cash | money }}</dd>
    </dl>
  </div>
  <div class="ui-col">
    <dl>
      <dt>累计收益</dt>
      <dd id="totalYield" class="{{ result.ttlIncRate | color }}">{{ result.ttlIncRate | rate }}</dd>
    </dl>
    <dl>
      <dt>日收益率</dt>
      <dd id="dayYield" class="{{ result.tdIncRate | color }}">{{ result.tdIncRate | rate }}</dd>
    </dl>
  </div>
</div>