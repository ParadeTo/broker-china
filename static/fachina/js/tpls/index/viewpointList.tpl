{{each data as item}}
  <div class="viewpoint-item">
    <div class="viewpoint-adviser">
      <img src="{{ item.uImg }}" alt=""/>
      <h4>#{{ item.uName }}投顾精选#</h4>
      <span>{{ item.adviserType }}</span>
    </div>
    <a class="viewpoint-content" href="{{ item.url }}">
      <div class="viewpoint-top">
        <span>精</span>
        <h4>{{ item.title }}</h4>
      </div>
      <div class="viewpoint-middle">
        <p>{{ item.summary }}</p>
        {{ if item.firstImg }}
        <div class="first-img">
          <img src="{{ item.firstImg }}" alt=""/>
        </div>
        {{ /if }}
      </div>
      <div class="viewpoint-footer">
        <span class="viewpoint-time">{{ item.viewpointTs }}</span>
        <span class="viewpoint-read">阅读 {{ item.readNum }}</span>
      </div>
    </a>
  </div>
{{/each}}