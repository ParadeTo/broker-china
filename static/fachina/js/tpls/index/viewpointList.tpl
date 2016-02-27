{{each data as item}}
  <li class="list-item">
    <em class="icon-good">精</em>
    <a href="{{ urlHost }}/webstatic/viewpoint/index.html?viewpointId={{ item.viewpointId}}">
      <h4>{{ item.title }}</h4>
      <dl class="ui-row">
        <dt class="ui-col">
          {{ item.uName }}&nbsp;
          {{ if item.adviserType}}
            {{ item.adviserType }}&nbsp;
          {{/if}}
          {{ if item.adviserOrg}}
            （{{ item.adviserOrg }}）
          {{/if}}
        </dt>
        <dd class="ui-col">阅读&nbsp;{{ item.readNum }}</dd>
      </dl>
    </a>
  </li>
{{/each}}