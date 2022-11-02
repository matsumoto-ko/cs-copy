<template>
  <div class="send-contents-wrapper">
    <sendContents
      v-bind:shops-data="shopsData"
      v-if="sendContentsShow"
    ></sendContents>
    <button class="button" @click="searchNearShops">地図を表示</button>
    <div id="map"></div>
  </div>
</template>
<script>
//require("dotenv").config({ debug: true });
import "dotenv/config";
//コンポーネントの読込
import sendContents from "@/components/sendContents";

//モジュールの読込
import getDisplayRatio from "@/myModules/getDisplayRatio";
//緯度経度を住所に変換する際、axiosを利用
import axios from "axios";
const url = process.env.VUE_APP_GEOAPIKEY;

//[gppgle api の設定]
//maps javascript apiで地図表示、マーカー作成
//その中のplaces libraryで周辺の店舗情報の取得
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.VUE_APP_APIKEY,
  version: process.env.VUE_APP_VERSION,
  libraries: ["places"],
});

let map;
let infowindow;

export default {
  components: {
    sendContents: sendContents,
  },
  data: function () {
    return {
      sendContentsShow: "",
      shopsData: {
        name: "",
        placeId: "",
        address: { prefecture: null, city: null, town: null },
      },
    };
  },
  methods: {
    searchNearShops: function () {
      //まずは現在地の取得
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            //取得した緯経度を地図を描画する関数に渡す
            this.makeMap(position.coords.latitude, position.coords.longitude);
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
          },
          (error) => {
            console.log(error.message);
          }
        );
      } else {
        console.log("your browser does not support geolocation API");
      }
    },
    makeMap: function (lati, long) {
      //mapのサイズを画面に合わせて取得
      this.getDisplayRatio("map");
      let self = this;
      loader.load().then((google) => {
        //make google object
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: lati, lng: long },
          zoom: 15,
          MapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        infowindow = new google.maps.InfoWindow();
        //make request to place api
        const request = {
          location: { lat: lati, lng: long },
          radius: process.env.VUE_APP_RADIUS,
          type: ["cafe"],
        };
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
        //get result from place api
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        }

        //use result
        function createMarker(result) {
          const marker = new google.maps.Marker({
            position: result.geometry.location,
            map: map,
          });
          google.maps.event.addListener(marker, "click", function () {
            console.log(result);
            self.sendContentsShow = true;
            self.shopsData.name = result.name;
            self.shopsData.placeId = result.place_id;
            getAddress(result);
            console.log(result.geometry.location.lng());

            console.log(self.sendContentsShow);
            infowindow.setContent(result.name);
            infowindow.open(map);
          });
        }
        async function getAddress(result) {
          //const self = this;
          try {
            const res = await axios.get(
              url +
                "&x=" +
                `${result.geometry.location.lng()}` +
                "&y=" +
                `${result.geometry.location.lat()}`
            );
            const items = res.data;
            console.log(items);
            console.log(items.response.location[0]);
            self.shopsData.address.prefecture =
              items.response.location[0].prefecture;
            self.shopsData.address.city = items.response.location[0].city;
            self.shopsData.address.town = items.response.location[0].town;
            //for (const item of items) {
            //  console.log(item);
            //}
            console.log(self.shopsData.address);
          } catch (error) {
            console.log(error);
            //const { status, statusText } = error.response;
            //console.log(`Error! HTTP Status: ${status} ${statusText}`);
          }
        }
      });
    },
    getDisplayRatio: getDisplayRatio,
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";
#map {
  margin: 0 auto;
}

//@media (max-width: $tablet-breakpoint) {}
</style>
