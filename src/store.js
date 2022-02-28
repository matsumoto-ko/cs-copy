import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    username: null,
  },
  mutations: {
    RegisterUsernameGlobally(state, userPostedName) {
      state.username = userPostedName;
    },
  },
});
