{{ each stks as item}}
<tr data-id="{{ item.assetId }}" data-name="{{ item.stkName }}" data-aBal="{{ item.aBal ? item.aBal : 0 }}">
  <td>
    <span>{{ item.stkName }}</span>
    <span class="font-10 text-light">{{ item.mktVal | price }}</span>
  </td>
  <td>
    <span class="right {{ item.yieldColor }}">{{ item.incBal | price }}</span>
    <span class="right {{ item.yieldColor }}">{{ item.hldYld | rate }}</span>
  </td>
  <td>
    <span class="right {{ item.yieldColor }}">{{ item.tBal }}</span>
    <span class="right {{ item.yieldColor }}">{{ item.aBal | notNull }}</span>
  </td>
  <td>
    <span class="right {{ item.yieldColor }}">{{ item.costPrc }}</span>
    <span class="right {{ item.yieldColor }}">{{ item.price }}</span>
  </td>
</tr>
{{ /each }}