<table class="ui-table">
  <thead>
    <tr>
      <th>操作</th>
      <th>股票名称</th>
      <th>委托价<br>成交价</th>
      <th>委托股数<br>成交股数</th>
      <th>状态</th>
    </tr>
  </thead>
  <tbody >
    {{ each stkOrds as item}}
<tr>
  <td>
    {{ if item.ordBS === 'B'}}
      <span class="text-red">买入</span>
    {{ else }}
     <span class="text-blue">卖出</span>
    {{ /if }}
  </td>
  <td>
    <span>{{ item.stkName }}</span>
    <span class="font-8 text-light">没返回时间</span>
  </td>
  <td>
    <span>{{ item.ordPrc }}</span>
    <span>{{ item.cfmPrc }}</span>
  </td>
  <td>
    <span>{{ item.ordQty }}</span>
    <span>{{ item.cfmQty }}</span>
  </td>
  <td>
    <span>{{ item.ordStat | ordStat }}</span>
  </td>
</tr>
{{ /each }}
  </tbody>
</table>
<div data-status="Y" class="ui-more" id="orderMore">
  <a href="javascript:;">点击加载更多</a>
</div>