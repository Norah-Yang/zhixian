<template>
    <div>
        <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
            <!--缩放-->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <!--定位-->
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <!--点-->
            <bm-marker
                :position="map.center"
                :dragging="map.dragging"
                animation="BMAP_ANIMATION_DROP"
            >
                <!--提示信息-->
            </bm-marker>
            <bm-local-search class="search" :keyword="map.keyword" :auto-viewport="true" ></bm-local-search>
        </baidu-map>
    </div>
</template>
 
<script>
export default {
  name: "simple-map",
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    handler({ BMap, map }) {
      let me = this;
      map.enableScrollWheelZoom(true);
      map.addEventListener("click", function(e) {
        new BMap.Geocoder().getLocation(
          new BMap.Point(e.point.lng, e.point.lat),
          function(result) {
            me.$emit("select-location", result);
          }
        );
      });
    }
  }
};
</script>
 
<style scoped>
.map {
  width: 100%;
  height: 400px;
}
.map .search {
  display: none;
}
</style>