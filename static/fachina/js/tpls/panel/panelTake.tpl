{{ each stks as item}}
<tr data-id="{{ item.assetId }}" data-name="{{ item.stkName }}" data-aBal="{{ item.aBal ? item.aBal : 0 }}">
  <td>
    <span>{{ item.stkName }}</span>
    <span class="font-10 text-light">{{ item.mktVal | price }}</span>
  </td>
  <td>
    <span class="right {{ item.incBal | color }}">{{ item.incBal | price }}</span>
    <span class="right {{ item.incBal | color }}">{{ item.hldYld | rate }}</span>
  </td>
  <td>
    <span class="right {{ item.incBal | color }}">{{ item.tBal }}</span>
    <span class="right {{ item.incBal | color }}">{{ item.aBal | notNull }}</span>
  </td>
  <td>
    <span class="right {{ item.incBal | color }}">{{ item.costPrc }}</span>
    <span class="right {{ item.incBal | color }}">{{ item.price }}</span>
  </td>
</tr>
{{ /each }}