{{if result}}
<div class="ui-container home-user-info">
  {{if result.uImg}}
  <div class="ui-avatar large">
    <img src="{{ result.uImg }}">
  </div>
  {{/if}}
  <div class="home-user-name">{{ result.uName }}</div>
  <div class="home-user-org">{{ result.adviserOrg }}</div>
</div>
{{/if}}