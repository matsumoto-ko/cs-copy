<template>
  <div>
    <div class="header">
      <!--<router-link to="/home" class="home">Home</router-link>-->
      <!--<p @click="signout" class="logout">ログアウトする</p>-->
    </div>
  </div>
</template>

<script>
//import signOutMethod from "@/firebaseFunctions/auth";
import { getAuth, signOut } from "firebase/auth";

export default {
  computed: {
    username() {
      return this.$store.state.username;
    },
  },
  methods: {
    //firebase authによるログアウト処理
    signout: function () {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
        })

        .catch((error) => {
          alert(error.message);

          alert(error.code);
        });
    },
  },
  created() {
    //if (this.$store.state.username == null) {
    //  const auth = getAuth();
    //  const user = auth.currentUser;
    //  if (user) {
    //    console.log("created");
    //    console.log(user);
    //    this.$store.commit("RegisterUsernameGlobally", user.displayName);
    //    //this.username = user.displayName;
    //    // User is signed in, see docs for a list of available properties
    //    // https://firebase.google.com/docs/reference/js/firebase.User
    //    // ...
    //  } else {
    //    console.log("username is fill");
    //    // No user is signed in.
    //  }
    //}
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";

.header {
  height: 65px;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  background-color: $sub-color;
  color: $sub-color;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.home {
  line-height: 65px;
  margin-right: 5px;
  padding: 0 10px;
  background-color: $background-color;
  text-decoration: none;
  opacity: 1;
  color: $sub-color;
  &:active {
    opacity: 0.6;
  }
}
.logout {
  margin: 0 15px 0 0;
  padding: 0 10px;
  line-height: 65px;
  background-color: $background-color;
  opacity: 1;
  &:active {
    opacity: 0.6;
  }
}
</style>
