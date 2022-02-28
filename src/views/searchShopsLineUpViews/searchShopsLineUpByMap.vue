<template>
  <div>
    <button class="button" @click="searchNearShops">地図を表示</button>

    <div id="map"></div>

    <div class="request" id="request">
      <h3 id="position1">{{ shopsData.name }}</h3>
      <button class="button" @click="sendRequestToDB" v-if="queryButtonShow">
        豆品種ラインナップを見る
      </button>

      <div class="error-handle">
        <h3 v-if="!errorShows.shopsExistence">
          まだデータが登録されていません
        </h3>
      </div>

      <div class="query-results">
        <div
          class="result"
          v-for="result in queryResult"
          :key="result.lineUp.name"
        >
          <p><span>品種名 </span>{{ result.lineUp.name }}</p>
          <p><span>生産国 </span>{{ result.lineUp.country }}</p>
          <p><span>農園 </span>{{ result.lineUp.farm }}</p>
          <p><span>登録日時</span>{{ result.lineUp.createdAt }}</p>
        </div>
        <button
          class="button"
          @click="sendNextRequestToDB"
          v-if="queryButtonShow2"
        >
          次の5件
        </button>
        <button class="button" @click="scrollToMap" v-if="queryButtonShow3">
          データはもうありません(上に戻る)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
//モジュールの読込
import getDisplayRatio from "@/myModules/getDisplayRatio";
import scrollToTarget from "@/myModules/scrollToTarget";
//import sanitaizeMethod from "@/myModules/sanitize";

//maps javascript api の設定
import { Loader } from "@googlemaps/js-api-loader";

require("dotenv").config({ debug: true });

const loader = new Loader({
  apiKey: process.env.VUE_APP_APIKEY,
  version: process.env.VUE_APP_VERSION,
  libraries: ["places"],
});

let map;
let infowindow;

//firebase firestoreの設定
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

const db = firebase.firestore();

export default {
  data() {
    return {
      show: "",
      mapshow: null,
      errorShows: {
        shopsExistence: true,
      },
      queryButtonShow: null,
      queryButtonShow2: null,
      queryButtonShow3: null,
      shopsData: {
        name: "ブルーボトル",
        placeId: "ChIJa9SVMG5dGGARP0P5I9pq_FA",
      },
      count: 0,
      lastVisibles: null,
      queryResult: [
        //{ name: "gg", country: "hfhff", farm: "jnkjfhkgs", createdAt: 3 },
        //{ name: "gg", country: "hfhff", farm: "jnkjfhkgs", createdAt: 4 },
        //{ name: "gg", country: "hfhff", farm: "jnkjfhkgs", createdAt: 5 },
        //{ name: "gg", country: "hfhff", farm: "jnkjfhkgs", createdAt: 6 },
      ],
    };
  },
  methods: {
    searchNearShops: async function () {
      //googlemapのサイズを画面に応じて調整
      await getDisplayRatio("map");
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
    }, //lati,long
    makeMap: function () {
      let self = this;
      loader.load().then((google) => {
        //make google object
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 35.457892, lng: 139.631661 },
          zoom: 15,
          MapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        infowindow = new google.maps.InfoWindow();
        //make request to place api
        const request = {
          location: { lat: 35.457892, lng: 139.631661 },
          radius: process.env.VUE_APP_RADIUS,
          type: ["cafe"],
        };
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
        //get result from place api
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
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
            //要素,表示のパラメーターリセット
            self.queryResult = [];
            self.errorShows.shopsExistence = true;
            self.queryButtonShow2 = null;
            self.queryButtonShow3 = null;
            self.shopsData.name = "";

            console.log(result);
            self.queryButtonShow = true;
            self.shopsData.name = result.name;
            self.shopsData.placeId = result.place_id;
            scrollToTarget("position1");
            infowindow.setContent(result.name);
            infowindow.open(map);
          });
        }
      });
    },
    sendRequestToDB: async function () {
      let self = this;
      try {
        //まずはお店ｘのドキュメントに標準を合わせ(collection.docで参照=Reference)て、実体を取得する(getで実体=snapShot)
        const shopsDocumentSnapshot = await db
          .collection("shops")
          .doc(self.shopsData.placeId)
          .get();
        if (shopsDocumentSnapshot.exists) {
          self.queryButtonShow2 = true;
          try {
            //取得した実体(snapShot)に.refをつけることで、Referenceに変更。上とおなじことをする。
            const documentReference = shopsDocumentSnapshot.ref;
            const lineUpSnapShot = await documentReference
              .collection("lineUps")
              .orderBy("lineUp.createdAt")
              .limit(2)
              .get();
            if (lineUpSnapShot.docs) {
              //collectionからドキュメントを複数とると、配列で帰ってくることに注意
              //if(lineUpSnapShot)ではうまく動かなかった
              //ページネーションに使うカウント
              //self.queryResultLength = 0;
              //self.queryResultLength += lineUpSnapShot.docs.length;
              //console.log(self.queryResultLength);

              self.lastVisibles =
                lineUpSnapShot.docs[lineUpSnapShot.docs.length - 1];

              //検索結果をひとつづつ取得していく
              self.count = 0;
              lineUpSnapShot.docs.forEach((doc) => {
                //ここで結果を利用できる。
                //console.log(doc.data().lineUp.createdAt);
                //timestampをdata型に
                let convertedCreatedAt = doc.data().lineUp.createdAt.toDate();
                //data型を読み取りやすいように取得、組み合わせ
                let year = convertedCreatedAt.getFullYear();
                let month = convertedCreatedAt.getMonth() + 1;
                let day = convertedCreatedAt.getDate();
                let readableCreatedAt = year + "-" + month + "-" + day;
                //vueのデータに格納
                self.queryResult.push(doc.data());
                self.queryResult[self.count].lineUp.createdAt =
                  readableCreatedAt;
                self.count++;
              });
            } else {
              console.log("lineUpSnapShot is not find");
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("shopsDocumentSnapShot is not find");
          self.errorShows.shopsExistence = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    sendNextRequestToDB: async function () {
      let self = this;
      try {
        //console.log(typeof self.queryResultLength);
        //まずはお店ｘのドキュメントに標準を合わせ(collection.docで参照=Reference)て、実体を取得する(getで実体=snapShot)
        const shopsDocumentSnapshot = await db
          .collection("shops")
          .doc(self.shopsData.placeId)
          .get();
        if (shopsDocumentSnapshot.exists) {
          try {
            //取得した実体(snapShot)に.refをつけることで、Referenceに変更。上とおなじことをする。
            const documentReference = shopsDocumentSnapshot.ref;
            const lineUpSnapShot = await documentReference
              .collection("lineUps")
              .orderBy("lineUp.createdAt")
              .startAfter(self.lastVisibles)
              .limit(2)
              .get();
            if (lineUpSnapShot.docs) {
              //ここで結果を利用できる。
              //collectionからドキュメントを複数とると、配列で帰ってくることに注意
              //if(lineUpSnapShot)ではうまく動かなかった
              //以下、検索結果をひとつづつ取得していく
              //ページネーション用
              self.lastVisibles =
                lineUpSnapShot.docs[lineUpSnapShot.docs.length - 1];
              lineUpSnapShot.docs.forEach((doc) => {
                //timestampをdata型に
                console.log(doc.data());
                let convertedCreatedAt = doc.data().lineUp.createdAt.toDate();
                //data型を読み取りやすいように取得、組み合わせ
                let year = convertedCreatedAt.getFullYear();
                let month = convertedCreatedAt.getMonth() + 1;
                let day = convertedCreatedAt.getDate();
                let readableCreatedAt = year + "-" + month + "-" + day;
                //vueのデータに格納
                self.queryResult.push(doc.data());
                self.queryResult[self.count].lineUp.createdAt =
                  readableCreatedAt;
                self.count++;
                console.log(self.queryResult);
              });
            } else {
              console.log("lineUpSnapShot is not find");
            }
          } catch (error) {
            console.log(error);
            self.queryButtonShow3 = true;
          }
        } else {
          console.log("shopsDocumentSnapShot is not find");
        }
      } catch (error) {
        console.log(error);
      }
    },
    scrollToMap: function () {
      scrollToTarget("map");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";
.query-results {
  display: flex;
  flex-wrap: wrap;
  @include query-results(40%);
}

#map {
  margin: 0 auto;
}

@media (max-width: $tablet-breakpoint) {
  .query-results {
    @include query-results(80%);
  }
}
@media (max-width: $pc-breakpoint) {
}
</style>
