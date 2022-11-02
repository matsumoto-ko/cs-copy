<template>
  <div class="presend-contents-wrapper">
    <div class="text">
      <h3>{{ shopsData.name }}のお豆情報を登録する</h3>
      <!----------------------------------------------->
      <div class="error-handle">
        <span v-if="errorShows.communicationError">
          サーバーとの通信でエラーが発生しました
          <br />
          お手数ですが、もう一度やり直してください
        </span>
        <span v-if="errorShows.lineUpError"
          >データの登録時にエラーが発生しました
          <br />
          お手数ですが、もう一度やり直してください</span
        >
        <span v-if="errorShows.shopsError"
          >データの登録時にエラーが発生しました
          <br />
          お手数ですが、もう一度やり直してください</span
        >
        <span v-if="seccusessShow">登録に成功しました</span>
      </div>
      <div class="input-wrapper mt-5">
        <div class="row">
          <div class="error-handle col-sm-8">
            <form>
              <div class="form-group">
                <label class="a" for="country">国名</label>
                <input
                  id="country"
                  type="text"
                  v-model="coffeeObject.lineUp.country"
                  @blur="$v.coffeeObject.lineUp.country.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.country.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.country.$error">
                  <span v-if="!$v.coffeeObject.lineUp.country.required"
                    >国名が入力されていません。</span
                  >
                  <span v-if="!$v.coffeeObject.lineUp.country.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>
              <!--入力1------------------------------------------>
              <!--<div class="roast-level">
                <label for="country">焙煎度</label>
                <input
                  id="country"
                  type="text"
                  v-model="coffeeObject.lineUp.name"
                  @blur="$v.coffeeObject.lineUp.name.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.name.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.name.$error">
                  <span v-if="!$v.coffeeObject.lineUp.name.required"
                    >名前が入力されていません。</span
                  >
                  <span v-if="!$v.coffeeObject.lineUp.name.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>-->
              <!------------------------------------------------->
              <div class="form-group">
                <label for="country">銘柄</label>
                <input
                  id="country"
                  type="text"
                  v-model="coffeeObject.lineUp.name"
                  @blur="$v.coffeeObject.lineUp.name.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.name.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.name.$error">
                  <span v-if="!$v.coffeeObject.lineUp.name.required"
                    >名前が入力されていません。</span
                  >
                  <span v-if="!$v.coffeeObject.lineUp.name.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>
              <!--入力2------------------------------------------>
              <!--<div class="form-group">
                <label for="farm">地域</label>
                <input
                  id="farm"
                  type="text"
                  v-model="coffeeObject.lineUp.farm"
                  @blur="$v.coffeeObject.lineUp.farm.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.farm.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.farm.$error">
                  <span v-if="!$v.coffeeObject.lineUp.farm.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>-->
              <!--入力3------------------------------------------>
              <!--<div class="form-group">
                <label for="farm">農園</label>
                <input
                  id="farm"
                  type="text"
                  v-model="coffeeObject.lineUp.farm"
                  @blur="$v.coffeeObject.lineUp.farm.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.farm.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.farm.$error">
                  <span v-if="!$v.coffeeObject.lineUp.farm.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>-->
              <!--入力4------------------------------------------>
              <div class="form-group">
                <label for="variety">品種</label>
                <input
                  id="variety"
                  type="text"
                  v-model="coffeeObject.lineUp.variety"
                  @blur="$v.coffeeObject.lineUp.variety.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.variety.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.variety.$error">
                  <span v-if="!$v.coffeeObject.lineUp.variety.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>
              <!--入力4------------------------------------------>
              <div class="form-group">
                <label for="processing">プロセス</label>
                <input
                  id="processing"
                  type="text"
                  v-model="coffeeObject.lineUp.processing"
                  @blur="$v.coffeeObject.lineUp.processing.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.processing.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.processing.$error">
                  <span v-if="!$v.coffeeObject.lineUp.processing.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>
              <!-------------------------------------------------->
              <!--<div class="form-group">
                <label for="farm">フレーバー</label>
                <input
                  id="farm"
                  type="text"
                  v-model="coffeeObject.lineUp.farm"
                  @blur="$v.coffeeObject.lineUp.farm.$touch()"
                  :class="{ error: $v.coffeeObject.lineUp.farm.$error }"
                />
                <div v-if="$v.coffeeObject.lineUp.farm.$error">
                  <span v-if="!$v.coffeeObject.lineUp.farm.maxLength"
                    >15字以内で入力してください</span
                  >
                </div>
              </div>-->
              <!-------------------------------------------->
              <!-------------------------------------------->
              <button class="btn btn-info" @click.prevent="resetInput">
                入力をクリア
              </button>
              <br />
              <button class="btn btn-info" @click.prevent="sendCoffeeObject">
                送信
              </button>
              <!-------------------------------------------->
            </form>
          </div>
        </div>
      </div>
    </div>
    <br />
    <!--<button class="button" @click="sendCoffeeObject">お豆情報を送る</button>-->
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
import Vue from "vue";

//[firestore の設定]
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
//require("dotenv").config({ debug: true });
import "dotenv/config";

const db = firebase.firestore();

//[gppgle api の設定]
//maps javascript apiで地図表示、マーカー作成
//place libraryで周辺の店舗情報の取得

export default Vue.extend({
  props: {
    //親viewからユーザーの豆情報を受け取り、forestoreに送信
    shopsData: {
      type: Object,
      default: function () {
        return {
          shopsDataIsNull: "---",
        };
      },
    },
  },
  data() {
    return {
      errorShows: {
        communicationError: false,
        lineUpError: false,
        shopsError: false,
      },
      seccusessShow: false,
      coffeeObject: {
        information: {
          name: "", //this.shopsData.name,,
          placeId: "", //this.shopsData.placeId,
          address: null, //this.shopsData.address,
          nearestStation: null, //this.shopsData.nearestSation
        },
        lineUp: {
          name: "",
          country: "",
          farm: "",
          variety: "",
          processing: "",
          createdAt: "",
          author: this.$store.state.username,
        },
      },
    };
  },
  validations: {
    coffeeObject: {
      lineUp: {
        name: { required, maxLength: maxLength(15) },
        country: { required, maxLength: maxLength(15) },
        variety: { maxLength: maxLength(15) },
        farm: { maxLength: maxLength(15) },
        processing: { maxLength: maxLength(15) },
      },
    },
  },
  methods: {
    resetInput() {
      this.coffeeObject.lineUp.name = "";
      this.coffeeObject.lineUp.country = "";
      this.coffeeObject.lineUp.farm = "";
      this.coffeeObject.lineUp.variety = "";
      this.coffeeObject.lineUp.processing = "";
    },
    sendCoffeeObject: function () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("バリデーションエラー");
      } else {
        // データ登録の処理をここに記述例)バックエンドサーバへのデータ送信
        console.log(this.coffeeObject);
        //登録日時を登録
        this.coffeeObject.lineUp.createdAt =
          firebase.firestore.FieldValue.serverTimestamp();
        //[searchShopsView]たちから送られてきたcoffeeobject.informationの情報を登録
        this.coffeeObject.information.name = this.shopsData.name;
        this.coffeeObject.information.placeId = this.shopsData.placeId;
        this.coffeeObject.information.address = this.shopsData.address;
        this.coffeeObject.information.nearestStation =
          this.shopsData.nearestStation;
        console.log(this.coffeeObject);

        //farm,varietyに入力がなかったら
        if (
          this.coffeeObject.lineUp.farm.length < 2 &&
          this.coffeeObject.lineUp.variety.length < 2
        ) {
          this.coffeeObject.lineUp.farm = "-";
          this.coffeeObject.lineUp.variety = "-";
        }
        //farmが空
        else if (this.coffeeObject.lineUp.farm.length < 2) {
          this.coffeeObject.lineUp.farm = "-";
        }
        //varietyが空
        else if (this.coffeeObject.lineUp.variety.length < 2) {
          this.coffeeObject.lineUp.variety = "-";
        }

        //エラー表示の要素をリセット
        this.errorShows.communicationError = false;
        this.errorShows.lineUpError = false;
        this.errorShows.shopsError = false;

        //placeidで登録する店がデータベースにあるかどうかを検索
        let self = this;
        db.collection("shops")
          .doc(this.coffeeObject.information.placeId)
          .get()
          .then((doc) => {
            //お店がすでに登録されていた場合
            if (doc.exists) {
              console.log("Document data:", doc.data());
              //lineupsデータのみを登録
              const sendCoffeeObject = db
                .collection("shops")
                .doc(self.coffeeObject.information.placeId)
                .collection("lineUps")
                .doc(self.coffeeObject.lineUp.name)
                .set(self.coffeeObject, { merge: true });
              sendCoffeeObject
                .then(() => {
                  console.log("seccusessfully uproaded");
                  self.seccusessShow = true;
                })
                .catch((error) => {
                  self.errorShows.lineUpError = true;
                  console.log(error);
                });
            } else {
              //お店が登録されていなかった場合
              // doc.data() will be undefined in self case
              console.log("No such document!");
              //shopsデータの登録
              const sendShopInfo = db
                .collection("shops")
                .doc(self.coffeeObject.information.placeId)
                .set(self.coffeeObject.information, { merge: true });
              sendShopInfo
                .then(() => {
                  console.log("seccusessfully uproaded");
                  self.seccusessShow = true;
                })
                .catch((error) => {
                  console.log(error);
                  self.errorShows.shopsError = true;
                });
              //lineupsデータの登録
              const sendCoffeeObject = db
                .collection("shops")
                .doc(self.coffeeObject.information.placeId)
                .collection("lineUps")
                .doc(self.coffeeObject.lineUp.name)
                .set(self.coffeeObject, { merge: true });
              sendCoffeeObject
                .then(() => {
                  console.log("seccusessfully uproaded");
                  self.seccusessShow = true;
                })
                .catch((error) => {
                  self.errorShows.lineUpError = true;
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
            self.errorShows.communicationError = true;
          });

        //const sendShopInfo = db
        //  .collection("shops")
        //  .doc(self.coffeeObject.information.placeId)
        //  .set(self.coffeeObject.information, { merge: true });

        ///const sendCoffeeObject = db
        ///  .collection("shops")
        ///  .doc(self.coffeeObject.information.placeId)
        ///  .collection("lineUps")
        ///  .doc(self.coffeeObject.lineUp.name)
        ///  .set(self.coffeeObject, { merge: true });

        ///sendCoffeeObject
        ///  .then(() => {
        ///    console.log("seccusessfully uproaded");
        ///  })
        ///  .catch((error) => {
        ///    console.log(error);
        ///  });
        if (self.seccusessShow == true) {
          setTimeout(function () {
            self.seccusessShow = !self.seccusessShow;
          }, 3000);
        }
      }
    },

    sendCoffeeObject1: async function () {
      let self = this;
      try {
        const shopsDocumentSnapshot = await db
          .collection("shops")
          .doc(this.coffeeObject.information.placeId)
          .get();
        if (shopsDocumentSnapshot) {
          //お店が登録されていた場合
          const documentReference = shopsDocumentSnapshot.ref;
          try {
            await documentReference
              .collection("lineUps")
              .doc(self.coffeeObject.lineUp.name);
            //.set(self.coffeeObject, { merge: true });
          } catch (error) {
            console.log(error);
          }
        } else {
          //お店が登録されていなかった場合
        }
      } catch (error) {
        console.log(error);
      }
    },
    //checkDocument() {
    //  let self = this;
    //  console.log(
    //    db.collection("shops").doc(self.coffeeObject.information.placeId)
    //  );
    //},
  },
});
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";

.presend-contents-wrapper {
  background-color: $background-color;
  padding-bottom: 10px;
  .text {
    text-align: center;
    .input-wrapper {
      text-align: left;
      display: inline-block;
      .btn {
        display: block;
        margin: 0 auto;
      }
      label {
        display: block;
      }
      span {
        display: block;
      }
      .form-group {
        padding: 10px auto;
      }
    }
  }
}
</style>
