<template>
  <div>
    <!--<router-link to="/home">Home</router-link>-->
    <h2>ログイン画面</h2>

    <div class="error-handle">
      <div class="form-group">
        <input
          type="text"
          placeholder="メールアドレス"
          v-model="email"
          @blur="$v.email.$touch()"
          :class="{ error: $v.email.$error }"
        />
        <div v-if="$v.email.$error">
          <span v-if="!$v.email.required"
            >メールアドレスが入力されていません。</span
          >
          <span v-if="!$v.email.maxLength">40字以内で入力してください</span>
          <span v-if="!$v.email.email">形式が正しくありません</span>
        </div>
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="パスワード"
          v-model="password"
          @blur="$v.password.$touch()"
          :class="{ error: $v.password.$error }"
        />
        <div v-if="$v.password.$error">
          <span v-if="!$v.password.required"
            >パスワードが入力されていません。</span
          >
          <span v-if="!$v.password.minLength">5文字以上が必要です</span>
          <span v-if="!$v.password.maxLength">30字以内で入力してください</span>
          <span v-if="!$v.password.email"
            >英数字でパスワードを入力してください</span
          >
        </div>
      </div>
    </div>

    <div>
      <button @click.prevent="signIn">サインイン</button>
    </div>
    <!--<p>
      アカウントを持っていませんか？<br />
      <router-link to="/signup">新規アカウント登録はこちら</router-link>
    </p>-->
  </div>
</template>

<script>
//import signInMethod from "@/firebaseFunctions/auth";
import sanitaizeMethod from "@/myModules/sanitize";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  required,
  maxLength,
  minLength,
  alphaNum,
  email,
} from "vuelidate/lib/validators";
import router from "@/router/index";

export default {
  data() {
    return {
      email: "coffeesearcher.test@gmail.com",
      password: "",
    };
  },
  validations: {
    email: { required, maxLength: maxLength(40), email },
    password: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(30),
      alphaNum,
    },
  },
  methods: {
    signIn: function () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        alert("バリデーションエラー");
      } else {
        alert("succesess");
        //バリデーションが成功したら
        this.email = sanitaizeMethod(this.email);
        this.password = sanitaizeMethod(this.password);
        //firebase authによるログイン処理
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            const user = userCredential.user; // eslint-disable-line no-unused-vars
            router.push("/home");
          })
          .catch((error) => {
            alert(error.message);
            alert(error.code);
          });
      }
    },
    //getUserInfo: function () {
    //  const auth = getAuth();
    //  const user = auth.currentUser;
    //  if (user) {
    //    console.log(user);
    //    // User is signed in, see docs for a list of available properties
    //    // https://firebase.google.com/docs/reference/js/firebase.User
    //    // ...
    //  } else {
    //    console.log("login yet");
    //    // No user is signed in.
    //  }
    //},
  },
};
</script>
