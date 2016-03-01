{{each data as item}}
  <a href="{{ urlHost }}/webstatic/viewpoint/index.html?viewpointId={{ item.viewpointId}}">{{ item.title }}</a>
{{/each}}