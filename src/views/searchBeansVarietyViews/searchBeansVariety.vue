<template>
  <div class="view-wrapper">
    <h3>検索したい豆品種を下記に入力して下さい</h3>
    <p>
      (国名をグアテマラ、都道府県を神奈川県、路線をみなとみらい線、駅名をみなとみらいにして頂けると、確実に店舗を参照できます。)
    </p>
    <div class="checkbox-wrapper">
      <div class="country">
        <input
          type="checkbox"
          id="country"
          name="country"
          @change="countryShow = !countryShow"
        />
        <label for="country">国名(country)</label>
        <input
          type="text"
          id="country"
          v-model="queries.countryQuery"
          value="ここに入力"
          v-if="countryShow"
        />
      </div>
      <div class="name">
        <input
          type="checkbox"
          id="name"
          name="name"
          @change="nameShow = !nameShow"
        />
        <label for="name">銘柄(name)</label>
        <input
          type="text"
          id="name"
          v-model="queries.nameQuery"
          value="ここに入力"
          v-if="nameShow"
        />
      </div>
      <div class="farm">
        <input
          type="checkbox"
          id="farm"
          name="farm"
          @change="farmShow = !farmShow"
        />
        <label for="farm">農園(farm) </label>
        <input
          type="text"
          id="farm"
          v-model="queries.farmQuery"
          value="ここに入力"
          v-if="farmShow"
        />
      </div>
      <div class="variety">
        <input
          type="checkbox"
          id="variety"
          name="variety"
          @change="varietyShow = !varietyShow"
        />
        <label for="variety">品種(variety)</label>
        <input
          type="text"
          id="variety"
          v-model="queries.varietyQuery"
          value="ここに入力"
          v-if="varietyShow"
        />
      </div>
      <div class="processing">
        <input
          type="checkbox"
          id="processing"
          name="processing"
          @change="processingShow = !processingShow"
        />
        <label for="processing">品種(processing)</label>
        <input
          type="text"
          id="processing"
          v-model="queries.processingQuery"
          value="ここに入力"
          v-if="processingShow"
        />
      </div>

      <!--<select v-model="queries.selectedPrefecture" @input="sendRequestToResas">
        <option disabled value="">Please select one</option>
        <option v-for="pref in prefDate" :key="`second-${pref.prefCode}`">
          {{ pref.prefName }}
        </option>
      </select>-->
      <h3>探したい地域を駅で絞り込み</h3>
      <p>都道府県</p>
      <v-select
        label="prefName"
        :options="prefDate"
        v-model="queries.selectedPrefecture"
        :reduce="(options) => options.prefName"
        @input="fetchLineData"
      />
      <!----------------------------------------->
      <p>路線</p>
      <v-select
        label="lineName"
        :options="lineData"
        v-model="queries.selectedLine"
        @input="fetchStationData"
      />
      <!--{{ queries.selectedPrefecture }}
      {{ queries.selectedline }}-->
      <!----------------------------------------->
      <p>駅名</p>
      <v-select
        label="name"
        :options="stationData"
        v-model="queries.selectedStation"
        :reduce="(options) => options.name"
      />
      <!--{{ queries.selectedStation }}-->
    </div>
    <button @click="sendRequestToDB">検索</button>
    <!------------------------------>
    <div class="error-handle" v-if="SearchErrorShow">
      <span class="delete-button" @click="offError">X</span><br />
      <div class="error">
        <p>検索結果がみつかりませんでした</p>
      </div>
    </div>
    <!----------------------------->
    <div class="error-handle" v-if="LoginErrorShow">
      <span class="delete-button" @click="offError">X</span><br />
      <div class="error">
        <p>ログインエラー</p>
        <p>お手数ですがもう一度ログインして下さい</p>
      </div>
    </div>
    <!------------------------------>
    <div class="request">
      <div class="query-results" v-if="QueryResultShow">
        <div class="result" v-for="value in queryResult" :key="value.index">
          <p class="shopname">{{ value.information.name }}</p>
          <div class="lineUp">
            <p><span>name</span>{{ value.lineUp.name }}</p>
            <p><span>country</span>{{ value.lineUp.country }}</p>
            <p><span>farm</span>{{ value.lineUp.farm }}</p>
            <p><span>variety</span>{{ value.lineUp.variety }}</p>
            <p><span>processing</span>{{ value.lineUp.processing }}</p>
            <p>
              <span>{{ value.lineUp.createdAt }}の情報</span>
            </p>
          </div>
        </div>
        <button
          class="button"
          @click="sendNextRequestToDB"
          v-if="queryButtonShow"
        >
          次の5件
        </button>
        <button class="button" v-if="queryButtonShow == false">
          データはもうありません(上に戻る)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
//require("dotenv").config({ debug: true });
import "dotenv/config";
//resas apiとの通信のための設定
import axios from "axios";
const getLineUrl = process.env.VUE_APP_HEARTRAIL_GETLINE_URL;
const getStationUrl = process.env.VUE_APP_HEARTRAIL_GETSTAION_URL;

//firebase firestoreの設定
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

const db = firebase.firestore();

export default {
  data() {
    return {
      nameShow: false,
      countryShow: false,
      farmShow: false,
      varietyShow: false,
      queryButtonShow: true,
      QueryResultShow: false,
      processingShow: false,
      SearchErrorShow: false,
      LoginErrorShow: false,

      queries: {
        nameQuery: "",
        countryQuery: "グアテマラ",
        farmQuery: "",
        varietyQuery: "",
        processingQuery: "",
        selectedPrefecture: "",
        selectedLine: "",
        selectedStation: "",
      },
      prefDate: [
        {
          prefCode: 13,
          prefName: "東京都",
        },
        {
          prefCode: 14,
          prefName: "神奈川県",
        },
      ],
      lineData: [],
      stationData: [],
      count: 0,
      lineUpsCollectionlastVisibles: null,
      queryResult: [
        {
          information: { name: "" }, //{ name: "ブルーボトルみなとみらいカフェ" },
          lineUp: {
            name: "",
            country: "",
            farm: "",
            variety: "",
            processing: "",
            createdAt: null,
          },
        },
      ],
      arrayKeys: ["buru-botoruminatomirai"],
    };
  },
  methods: {
    offError: function () {
      this.errorShow = false;
    },
    fetchLineData: async function () {
      const self = this;
      //console.log(getLineUrl);
      const encodeUrl = encodeURI(
        getLineUrl + "&prefecture=" + self.queries.selectedPrefecture
      );
      //console.log(encodeUrl);
      try {
        const res = await axios.get(encodeUrl);
        self.lineData = res.data.response.line;
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
    },
    fetchStationData: async function () {
      const self = this;
      //console.log(getStationUrl);
      const encodeUrl = encodeURI(
        getStationUrl + "&line=" + self.queries.selectedLine
      );
      //console.log(encodeUrl);
      try {
        const res = await axios.get(encodeUrl);
        self.stationData = res.data.response.station;
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
    },
    //sendRequestToResas: async function () {
    //  const self = this;
    //  try {
    //    const results = await axios.get(
    //      url + `${self.queries.selectedPrefecture}`,
    //      {
    //        headers: { "X-API-KEY": process.env.VUE_APP_RESASAPIKEY },
    //      }
    //    );
    //    self.wardDate = results.data.result;
    //    console.log(self.wardDate);
    //  } catch (error) {
    //    console.log(error);
    //  }
    //},
    open: function (arrayKey) {
      window.open("https://www.google.com/search?q=" + arrayKey);
    },
    sendRequestToDB: async function () {
      let self = this;
      try {
        let lineUpsSubCollectionReference = await db.collectionGroup("lineUps");
        //駅名の検索条件を追加
        lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
          "information.nearestStation.name",
          "==",
          self.queries.selectedStation
        );
        //路線の検索条件を追加
        //lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
        //  "information.nearestStation.line",
        //  "==",
        //  self.queries.selectedLine
        //);
        if (self.queries.nameQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.name",
            "==",
            self.queries.nameQuery
          );
        }
        if (self.queries.countryQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.country",
            "==",
            self.queries.countryQuery
          );
        }
        if (self.queries.farmQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.farm",
            "==",
            self.queries.farmQuery
          );
        }
        if (self.queries.varietyQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.variety",
            "==",
            self.queries.varietyQuery
          );
        }
        if (self.queries.processingQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.processing",
            "==",
            self.queries.processingQuery
          );
        }
        const lineUpSnapShot = await lineUpsSubCollectionReference
          .orderBy("lineUp.createdAt")
          .limit(2)
          .get();
        //console.log(lineUpSnapShot.docs);

        //lineUpSnapShot.forEach((doc) => {
        //  console.log(doc.data());
        //});

        if (lineUpSnapShot.docs.length > 0) {
          //検索結果をひとつづつ取得していく
          //ページネーション用に、検索結果の最後の要素を取得しておく
          self.lineUpsCollectionlastVisibles =
            lineUpSnapShot.docs[lineUpSnapShot.docs.length - 1];

          //↓vueに格納したデータを参照するためのカウントをリセット
          self.count = 0;
          self.queryResult = [];

          for (const doc of lineUpSnapShot.docs) {
            try {
              //旧版
              //let searchShopName = doc.data().information.name;
              //if (self.queryResult[searchShopName]) {
              //  //すでにqueryresultにデータがあったら
              //  //v-forのkey用にカウントをlineUpに渡す
              //  let preSendLineUp = doc.data().lineUp;
              //  preSendLineUp.num = self.count;

              //  //データの格納
              //  self.queryResult[searchShopName].push(preSendLineUp);
              //  self.queryResult[searchShopName][self.count].address =
              //    doc.data().information.adress;
              //  self.count++;
              //} else {
              //  //データがなかったら配列を用意
              //  self.queryResult[searchShopName] = [];
              //  //v-forのkey用にカウントをlineUpに渡す
              //  let preSendLineUp = doc.data().lineUp;
              //  preSendLineUp.num = self.count;

              //  //データの格納
              //  self.queryResult[searchShopName].push(preSendLineUp);
              //  self.queryResult[searchShopName][self.count].address =
              //    doc.data().information.adress;
              //  self.count++;
              //}
              //取得したデータの加工↓

              //取得したデータにそれぞれ番号を渡す。
              let content = doc.data();
              content["index"] = self.count;
              //timestampをdata型に
              let convertedCreatedAt = content.lineUp.createdAt.toDate();
              //data型を読み取りやすいように取得、組み合わせ
              let year = convertedCreatedAt.getFullYear();
              let month = convertedCreatedAt.getMonth() + 1;
              let day = convertedCreatedAt.getDate();
              let readableCreatedAt = year + "-" + month + "-" + day;
              content.lineUp.createdAt = readableCreatedAt;
              //データを格納
              self.queryResult.push(content);

              self.count++;

              //console.log(doc.data());
            } catch (error) {
              console.log(error); // eslint-disable-line no-console
            }
          }
          self.QueryResultShow = true;
          //console.log(self.queryResult);
          //console.log(Object.keys(self.queryResult));
          //self.arrayKeys = Object.keys(self.queryResult);

          //lineUpSnapShot.docs.forEach((doc) => {
          //  const lineUpsDocumentRef = doc.ref;
          //  const lineUpsRef = lineUpsDocumentRef.parent;
          //  const shopsDocumentRef = lineUpsRef.parent;

          //  const shopsdocumentSnapShot = await shopsDocumentRef.get();
          //  //ここで結果を利用できる。
          //  //console.log(doc.data().lineUp.createdAt);
          //  //timestampをdata型に
          //  let convertedCreatedAt = doc.data().lineUp.createdAt.toDate();
          //  //data型を読み取りやすいように取得、組み合わせ
          //  let year = convertedCreatedAt.getFullYear();
          //  let month = convertedCreatedAt.getMonth() + 1;
          //  let day = convertedCreatedAt.getDate();
          //  let readableCreatedAt = year + "-" + month + "-" + day;
          //  //ひとまず検索結果をvueのデータに格納
          //  self.queryResult.push(doc.data());
          //  //格納したデータのcreatedAtを読めるcreatedAtに入れ替え
          //  self.queryResult[self.count].lineUp.createdAt = readableCreatedAt;
          //  self.count++;
          //});
        } else {
          console.log("No such Document"); // eslint-disable-line no-console
          self.errorShow = true;
        }
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
        //self.err;
      }
    },
    sendNextRequestToDB: async function () {
      let self = this;
      try {
        let lineUpsSubCollectionReference = await db.collectionGroup("lineUps");
        lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
          "information.nearestStation.name",
          "==",
          self.queries.selectedStation
        );
        //lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
        //  "information.nearestStation.line",
        //  "==",
        //  self.queries.selectedLine
        //);
        if (self.queries.nameQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.name",
            "==",
            self.queries.nameQuery
          );
        }
        if (self.queries.countryQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.country",
            "==",
            self.queries.countryQuery
          );
        }
        if (self.queries.farmQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.farm",
            "==",
            self.queries.farmQuery
          );
        }
        if (self.queries.varietyQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.variety",
            "==",
            self.queries.varietyQuery
          );
        }
        if (self.queries.processingQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.processing",
            "==",
            self.queries.processingQuery
          );
        }
        const lineUpSnapShot = await lineUpsSubCollectionReference
          .orderBy("lineUp.createdAt")
          .startAfter(self.lineUpsCollectionlastVisibles)
          .limit(2)
          .get();
        if (lineUpSnapShot.docs) {
          //検索結果をひとつづつ取得していく
          //ページネーション用に、検索結果の最後の要素を取得しておく
          self.lineUpsCollectionlastVisibles =
            lineUpSnapShot.docs[lineUpSnapShot.docs.length - 1];
          for (const doc of lineUpSnapShot.docs) {
            try {
              //取得したデータにそれぞれ番号を渡す。
              let content = doc.data();
              content["index"] = self.count;
              //timestampをdata型に
              let convertedCreatedAt = content.lineUp.createdAt.toDate();
              //data型を読み取りやすいように取得、組み合わせ
              let year = convertedCreatedAt.getFullYear();
              let month = convertedCreatedAt.getMonth() + 1;
              let day = convertedCreatedAt.getDate();
              let readableCreatedAt = year + "-" + month + "-" + day;
              content.lineUp.createdAt = readableCreatedAt;
              //データを格納
              self.queryResult.push(content);

              self.count++;
              //console.log(doc.data());
            } catch (error) {
              console.log(error); // eslint-disable-line no-console
            }
          }
          //console.log(self.queryResult);
          self.arrayKeys = Object.keys(self.queryResult);
        } else {
          console.log("no such document"); // eslint-disable-line no-console
        }
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
        self.queryButtonShow = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";
.error-handle {
  margin-top: 15px;
  padding-top: 5px;
  padding-bottom: 3px;
  background-color: #ffd9d9;
  span {
    float: right;
    margin-right: 10px;
    border: solid 1px black;
    line-height: 13px;
  }
}
.query-results {
  display: flex;
  flex-wrap: wrap;
  @include query-results(40%);
}
.result {
  box-shadow: 3px 2px gainsboro;
  padding-top: 10px;
  padding-bottom: 10px;
  .shopname {
    font-weight: bold;
  }
  .lineUp {
    text-align: left;
  }
  span {
    color: #b15a5e;
  }
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
