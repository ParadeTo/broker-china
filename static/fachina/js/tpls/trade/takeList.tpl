{{ each stks as item}}
<tr data-id="{{ item.assetId }}">
  <td>
    <span>{{ item.stkName }}</span>
    <span class="font-10 text-light">{{ item.mktVal }}</span>
  </td>
  <td>
    <span class="right {{ item.incBal | color }}">{{ item.incBal }}</span>
    <span class="right {{ item.incBal | color }}">{{ item.hldYld }}</span>
  </td>
  <td>
    <span class="right {{ item.incBal | color }}">{{ item.tBal }}</span>
    <span class="right {{ item.incBal | color }}">{{ item.aBal }}</span>
  </td>
  <td>
    <span class="right {{ item.incBal | color }}">{{ item.costPrc }}</span>
    <span class="right {{ item.incBal | color }}">{{ item.price }}</span>
  </td>
</tr>
{{ /each }}