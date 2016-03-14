{{if result}}
<div class="ui-container home-user-info">
  <div class="ui-avatar large">
    {{if result.uImg}}
    <img src="{{ result.uImg }}">
    {{/if}}
  </div>
  <div class="home-user-name">{{ result.uName | isNull }}</div>
  <div class="home-user-org">{{ result.adviserOrg }}</div>
</div>
{{/if}}