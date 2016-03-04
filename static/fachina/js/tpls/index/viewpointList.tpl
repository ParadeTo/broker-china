{{each data as item}}
  <li class="list-item">
    <em class="icon-good">精</em>
    <a href="{{ item.shareUrl }}">
      <h4>{{ item.title }}</h4>
      <dl class="ui-row">
        <dt class="ui-col">
        {{ item.uName }}
        {{ item.adviserType }}
        {{ if item.adviserOrg}}
        （{{ item.adviserOrg }}）
        {{ /if }}
        </dt>
        <dd class="ui-col">阅读 {{ item.readNum }}</dd>
      </dl>
    </a>
  </li>
{{/each}}