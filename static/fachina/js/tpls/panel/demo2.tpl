{{ each stks as item}}
<tr data-id="{{ item.assetId }}">
  <td>
    <span>{{ item.stkName }}</span>
    <span>{{ item.mktVal }}</span>
  </td>
  <td>
    <span>{{ item.incBal }}</span>
    <span>{{ item.hldYld }}</span>
  </td>
  <td>
    <span>{{ item.tBal }}</span>
    <span>{{ item.aBal }}</span>
  </td>
  <td>
    <span>{{ item.costPrc }}</span>
    <span>{{ item.price }}</span>
  </td>
</tr>
{{ /each }}