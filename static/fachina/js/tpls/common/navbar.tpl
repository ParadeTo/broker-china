<li class="ui-col">
  <a href="./index.html" class="nav-link active">大赛首页</a>
</li>
<li class="ui-col">
  {{ if status === '1' }}
    <a href="javascript:J_app.userLogin();" class="nav-link">个人中心</a>
  {{ else }}
    <a href="./home.html" class="nav-link">个人中心</a>
  {{ /if }}
</li>
<li class="ui-col">
  {{ if status === '1' }}
    <a href="javascript:J_app.userLogin();" class="nav-link">模拟交易</a>
  {{ else if status === '2' || status === '3' }}
    <a href="./enroll_entry.html" class="nav-link">模拟交易</a>
  {{ else }}
    <a href="./trade.html" class="nav-link">模拟交易</a>
  {{ /if }}
</li>
<li class="ui-col">
  <a href="./ranking.html" class="nav-link">排行榜</a>
</li>