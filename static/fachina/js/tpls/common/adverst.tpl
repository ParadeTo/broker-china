{{each result as item}}
<div class="swiper-slide">
  <a data-id="{{item.adId}}" href="{{item.adUrl}}" style="background-image:url({{item.adImg}})"></a>
</div>
{{/each}}