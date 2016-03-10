{{ each stks as item}}
<tr
  data-type="{{ item.busType }}"
  data-seq="{{ item.ordSeq }}"
  data-tid="{{ item.ptfTransId }}"
  data-code="{{ item.assetId }}"
  data-name="{{ item.stkName }}"
  data-oprc="{{ item.ordPrc | price }}"
  data-oqty="{{ item.ordQty }}"
  data-cqty="{{ item.cfmQty }}">
  <td>
    {{ if item.busType === 'B'}}
      <i class="icon-buy">买</i>
    {{ else }}
     <i class="icon-sell">卖</i>
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