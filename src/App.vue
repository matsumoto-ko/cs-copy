<template>
  <div id="app">
    <div class="whole-wrapper">
      <header>
        <Header></Header>
      </header>
      <div class="container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
require("dotenv").config({ debug: true });

import Header from "@/views/Header";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGEINGSENDERID,
  appId: process.env.VUE_APP_APPID,
  measurementId: process.env.VUE_APP_MEASUREMENTID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default {
  name: "App",
  components: {
    Header: Header,
  },
};
</script>

<style lang="scss">
@import "@/scss/_variables.scss";
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.whole-wrapper {
  text-align: center;
  color: $sub-color;
}
header {
  margin-bottom: 80px;
}
.container {
  width: 100%;
  margin: 0 auto;
}

.button {
  @include button(25%);
}
.error-handle {
  color: #b15a5e;
  span {
    display: block;
  }
}
.error {
  background-color: #ffd9d9;
}

@media (max-width: $tablet-breakpoint) {
  .button {
    @include button(80%);
  }
}
</style>
