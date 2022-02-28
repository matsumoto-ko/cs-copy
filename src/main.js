import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css"; // add
import "bootstrap-vue/dist/bootstrap-vue.css"; // add
//import firebase from "firebase/app";

//require("dotenv").config({ debug: true });
//
//const firebaseConfig = {
//  apiKey: process.env.VUE_APP_API_KEY,
//  authDomain: process.env.VUE_APP_AUTHDOMAIN,
//  projectId: process.env.VUE_APP_PROJECTID,
//  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
//  messagingSenderId: process.env.VUE_APP_MESSAGEINGSENDERID,
//  appId: process.env.VUE_APP_APPID,
//  measurementId: process.env.VUE_APP_MEASUREMENTID,
//};
//// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;
Vue.use(Vuelidate);

//コンポーネントの登録

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
