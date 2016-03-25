<table>
  <thead>
    <tr>
      <th></th>
      {{each eventTimes as item}}
        <td>第{{item.eventSeason}}季</td>
      {{/each}}
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>报名期</td>
      {{each eventTimes as item}}
        <td>{{item.registDate}}</td>
      {{/each}}
    </tr>
    <tr>
      <td>比赛期</td>
      {{each eventTimes as item}}
        <td>{{item.gameDate}}</td>
      {{/each}}
    </tr>
  </tbody>
</table>