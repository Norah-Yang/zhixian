<template>
    <div>
        <baidu-map class="map" :center="position" :zoom="13" @ready="handler">
            <!--缩放-->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <!--定位-->
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <!--点-->
            <bm-marker
                :position="position"
                :dragging="true"
                animation="BMAP_ANIMATION_DROP"
            >
                <!--提示信息-->
            </bm-marker>
            <bm-local-search class="search" :keyword="position.keyword" :auto-viewport="true" ></bm-local-search>
        </baidu-map>
    </div>
</template>
 
<script>
export default {
  props: {
    position:{
      type:Object
    }
  },
  created(){
   
  },
  data() {
    return {
      
    };
  },
  
  methods: {
    handler({ BMap, map }) {
      console.log("-----",this.position)
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