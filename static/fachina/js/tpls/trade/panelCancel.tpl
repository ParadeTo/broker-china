{{ each stks as item}}
<tr>
  <td>
    {{ if item.ordBS === 'B'}}
      <i class="icon-buy">买</i>
    {{ else }}
     <i class="icon-sell">卖</i>
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