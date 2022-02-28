<template>
  <div class="view-wrapper">
    <h3>検索したいお店を下記のように入力して下さい</h3>
    <p>(例 ・・コーヒー店 東京 世田谷店 など)</p>
    <input type="text" v-model="searchName" value="ここに入力" />
    <button @click="searchShopsByWord">検索</button>
    <br />
    <div id="map"></div>

    <div class="request">
      <h3>{{ shopsData.name }}</h3>
      <div class="button" @click="sendRequestToDB" v-if="queryButtonShow">
        豆品種ラインナップを見る
      </div>
      <hr id="position1" />

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
import sanitaizeMethod from "@/myModules/sanitize";
import scrollToTarget from "@/myModules/scrollToTarget";

//[gppgle api の設定]
//maps javascript apiで地図表示、マーカー作成
//その中のplaces libraryで周辺の店舗情報の取得
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
      searchName: "",
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
    searchShopsByWord() {
      //googlemapのサイズを画面に応じて調整
      getDisplayRatio("map");
      //入力のサニタイズ
      this.searchName = sanitaizeMethod(this.searchName);

      //要素,表示のパラメーターリセット
      this.queryResult = [];
      this.errorShows.shopsExistence = true;
      this.queryButtonShow = null;
      this.queryButtonShow2 = null;
      this.queryButtonShow3 = null;
      this.shopsData.name = "";

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
        const request = {
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
#position1 {
  width: 70%;
}
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
