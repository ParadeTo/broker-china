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
    <span class="font-8 text-light">{{ item.assetId }}</span>
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