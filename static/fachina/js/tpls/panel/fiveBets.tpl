<ul class="trade-five_bets">
  {{ each ask }}
  <li data-price="{{ask.price}}">
    <span>卖{{ ask.index }}</span>
    <span>{{ ask.price }}</span>
    <span>{{ ask.vol }}</span>
  </li>
  {{ /each }}
</ul>
<ul class="trade-five_bets">
  {{ each bid }}
  <li data-price="{{ask.price}}">
    <span>买{{ bid.index }}</span>
    <span>{{ bid.price }}</span>
    <span>{{ bid.vol }}</span>
  </li>
  {{/each}}
</ul>