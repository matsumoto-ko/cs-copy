import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css"; // add
import "bootstrap-vue/dist/bootstrap-vue.css"; // add
import "vue-select/dist/vue-select.css";
//vue-select 読込
import vSelect from "vue-select";

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.component("v-select", vSelect);

//コンポーネントの登録

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
