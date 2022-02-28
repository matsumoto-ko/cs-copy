<template>
  <div class="view-wrapper">
    <h3>検索したいお店を下記のように入力して下さい</h3>
    <p>(例 ・・コーヒー店 東京 世田谷店 など)</p>
    <div class="checkbox-wrapper">
      <div class="name">
        <input
          type="checkbox"
          id="name"
          name="name"
          @change="nameShow = !nameShow"
        />
        <label for="name">国名(name)</label>
        <input
          type="text"
          id="name"
          v-model="queries.nameQuery"
          value="ここに入力"
          v-if="nameShow"
        />
      </div>
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
    </div>
    <button @click="sendRequestToDB">検索</button>
    <div class="request">
      <div class="query-results">
        <div class="result" v-for="key in arrayKeys" :key="key">
          <div @click="open(key)">
            {{ key }}
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
      queries: {
        nameQuery: "",
        countryQuery: "",
        farmQuery: "",
        varietyQuery: "",
      },
      count: 0,
      lineUpsCollectionlastVisibles: null,
      queryResult: {
        //{ name: "gg", country: "hfhff", farm: "jnkjfhkgs", placeId: 3 },
        //{ name: "aa", country: "hfhff", farm: "jnkjfhkgs", placeId: 4 },
        //{ name: "ff", country: "hfhff", farm: "jnkjfhkgs", placeId: 5 },
        //{ name: "kk", country: "hfhff", farm: "jnkjfhkgs", placeId: 6 },
      },
      arrayKeys: ["buru-botoruminatomirai"],
    };
  },
  methods: {
    open: function (arrayKey) {
      window.open("https://www.google.com/search?q=" + arrayKey);
    },
    sendRequestToDB: async function () {
      let self = this;
      try {
        let lineUpsSubCollectionReference = await db.collectionGroup("lineUps");
        if (self.queries.nameQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.name",
            "==",
            self.queries.nameQuery
          );
          console.log(1);
        }
        if (self.queries.countryQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.country",
            "==",
            self.queries.countryQuery
          );
          console.log(1);
        }
        if (self.queries.farmQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.farm",
            "==",
            self.queries.farmQuery
          );
          console.log(2);
        }
        if (self.queries.varietyQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.variety",
            "==",
            self.queries.varietyQuery
          );
          console.log(3);
        }
        const lineUpSnapShot = await lineUpsSubCollectionReference
          .orderBy("lineUp.createdAt")
          .limit(2)
          .get();
        console.log(lineUpSnapShot.docs);

        //lineUpSnapShot.forEach((doc) => {
        //  console.log(doc.data());
        //});

        if (lineUpSnapShot.docs) {
          //検索結果をひとつづつ取得していく
          //ページネーション用に、検索結果の最後の要素を取得しておく
          self.lineUpsCollectionlastVisibles =
            lineUpSnapShot.docs[lineUpSnapShot.docs.length - 1];

          //↓vueに格納したデータを参照するためのカウント
          self.count = 0;

          for (const doc of lineUpSnapShot.docs) {
            try {
              let searchShopName = doc.data().information.name;
              if (self.queryResult[searchShopName]) {
                //すでにqueryresultにデータがあったら
                //v-forのkey用にカウントをlineUpに渡す
                let preSendLineUp = doc.data().lineUp;
                preSendLineUp.num = self.count;

                //データの格納
                self.queryResult[searchShopName].push(preSendLineUp);
                self.queryResult[searchShopName][self.count].address =
                  doc.data().information.adress;
                self.count++;
              } else {
                //データがなかったら配列を用意
                self.queryResult[searchShopName] = [];
                //v-forのkey用にカウントをlineUpに渡す
                let preSendLineUp = doc.data().lineUp;
                preSendLineUp.num = self.count;

                //データの格納
                self.queryResult[searchShopName].push(preSendLineUp);
                self.queryResult[searchShopName][self.count].address =
                  doc.data().information.adress;
                self.count++;
              }

              console.log(doc.data());
            } catch (error) {
              console.log(error);
            }
          }
          console.log(self.queryResult);
          console.log(Object.keys(self.queryResult));
          self.arrayKeys = Object.keys(self.queryResult);

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
          console.log("No such Document");
        }
      } catch (error) {
        console.log(error);
      }
    },
    sendNextRequestToDB: async function () {
      let self = this;
      try {
        let lineUpsSubCollectionReference = await db.collectionGroup("lineUps");
        if (self.queries.nameQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.name",
            "==",
            self.queries.nameQuery
          );
          console.log(1);
        }
        if (self.queries.countryQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.country",
            "==",
            self.queries.countryQuery
          );
          console.log(1);
        }
        if (self.queries.farmQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.farm",
            "==",
            self.queries.farmQuery
          );
          console.log(2);
        }
        if (self.queries.varietyQuery != "") {
          lineUpsSubCollectionReference = lineUpsSubCollectionReference.where(
            "lineUp.variety",
            "==",
            self.queries.varietyQuery
          );
          console.log(3);
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
              let searchShopName = doc.data().information.name;
              if (self.queryResult[searchShopName]) {
                //すでにqueryresultにデータがあったら
                //v-forのkey用にカウントをlineUpに渡す
                let preSendLineUp = doc.data().lineUp;
                preSendLineUp.num = self.count;

                //データの格納
                self.queryResult[searchShopName].push(preSendLineUp);
                self.queryResult[searchShopName][self.count].address =
                  doc.data().information.adress;
                self.count++;
              } else {
                //データがなかったら配列を用意
                self.queryResult[searchShopName] = [];
                //v-forのkey用にカウントをlineUpに渡す
                let preSendLineUp = doc.data().lineUp;
                preSendLineUp.num = self.count;

                //データの格納
                self.queryResult[searchShopName].push(preSendLineUp);
                self.queryResult[searchShopName][self.count].address =
                  doc.data().information.adress;
                self.count++;
              }

              console.log(doc.data());
            } catch (error) {
              console.log(error);
            }
          }
          console.log(self.queryResult);
          self.arrayKeys = Object.keys(self.queryResult);
        } else {
          console.log("no such document");
        }
      } catch (error) {
        console.log(error);
        console.log(error);
        self.queryButtonShow = false;
      }
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
.result {
  padding-top: 10px;
  padding-bottom: 10px;
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
