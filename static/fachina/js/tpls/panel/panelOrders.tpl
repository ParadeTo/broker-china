{{ each stkOrds as item}}
<tr>
  <td>
    {{ if item.busType === 'B'}}
      <span class="text-red">买入</span>
    {{ else }}
     <span class="text-blue">卖出</span>
    {{ /if }}
  </td>
  <td>
    <span>{{ item.stkName }}</span>
    <span class="font-8 text-light">{{ item.ordTime | dateFormat:'hh:mm:ss'}}</span>
  </td>
  <td>
    <span class="right">{{ item.ordPrc | price }}</span>
    <span class="right">{{ item.cfmPrc | price }}</span>
  </td>
  <td>
    <span class="right">{{ item.ordQty }}</span>
    <span class="right">{{ item.cfmQty }}</span>
  </td>
  <td>
    <span>{{ item.displayStatus | ordStat }}</span>
  </td>
</tr>
{{ /each }}
