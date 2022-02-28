<template>
  <div>
    <h3>検索したいお店を下記のように入力して下さい</h3>
    <p>(例 ・・コーヒー店 東京 世田谷店 など)</p>
    <input type="text" v-model="searchName" value="ここに入力" />
    <button @click="searchShopsByWord">検索</button>
    <sendContents
      v-bind:shops-data="shopsData"
      v-if="sendContentsShow"
    ></sendContents>
    <br />
    <div id="map"></div>
  </div>
</template>

<script>
//コンポーネントの読込
import sendContents from "@/components/sendContents";
//モジュールの読込
import getDisplayRatio from "@/myModules/getDisplayRatio";
import sanitaizeMethod from "@/myModules/sanitize";

//緯度経度を住所に変換する際、axiosを利用
import axios from "axios";
const url = "http://geoapi.heartrails.com/api/json?method=searchByGeoLocation";

//[gppgle api の設定]
//maps javascript apiで地図表示、マーカー作成
//その中のplaces libraryで周辺の店舗情報の取得
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyD18GjH_cPwVb7M2L7qEHLdjIHHyNh_mBU",
  version: "weekly",
  libraries: ["places"],
});
let map;
let infowindow;

export default {
  components: {
    sendContents: sendContents,
  },
  data() {
    return {
      sendContentsShow: "",
      searchName: "",
      shopsData: {
        name: "",
        placeId: "",
        address: { prefecture: null, city: null, town: null },
      },
    };
  },
  methods: {
    searchShopsByWord() {
      //googlemapのサイズを画面に応じて調整
      getDisplayRatio("map");
      //入力のサニタイズ
      this.searchName = sanitaizeMethod(this.searchName);

      //まずは入力された店の名前から、クエリ検索を行う

      let self = this;
      loader.load().then((google) => {
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 35.6809591, lng: 139.7673068 },
          zoom: 15,
          MapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        infowindow = new google.maps.InfoWindow();
        //検索する条件の指定
        let request = {
          query: self.searchName,
          fields: ["name", "geometry", "place_id"],
        };
        //検索の実行
        const service = new google.maps.places.PlacesService(map);
        service.findPlaceFromQuery(request, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
            map.setCenter(results[0].geometry.location);
          }
        });

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
            console.log(self.shopsData.adress);
          } catch (error) {
            console.log(error);
            //const { status, statusText } = error.response;
            //console.log(`Error! HTTP Status: ${status} ${statusText}`);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";

#map {
  margin: 0 auto;
}
</style>
