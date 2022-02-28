<template>
  <div>
    <h2>新規アカウント登録</h2>
    <div class="error-handle">
      <div class="form-group">
        <input
          type="email"
          placeholder="メールアドレス"
          v-model="userInfo.email"
          @blur="$v.userInfo.email.$touch()"
          :class="{ error: $v.userInfo.email.$error }"
        />
        <div v-if="$v.userInfo.email.$error">
          <span v-if="!$v.userInfo.email.required"
            >メールアドレスが入力されていません。</span
          >
          <span v-if="!$v.userInfo.email.maxLength"
            >40字以内で入力してください</span
          >
          <span v-if="!$v.userInfo.email.email">形式が正しくありません</span>
        </div>
      </div>

      <div class="form-group">
        <input
          type="password"
          placeholder="パスワード"
          v-model="userInfo.password"
          @blur="$v.userInfo.password.$touch()"
          :class="{ error: $v.userInfo.password.$error }"
        />
        <div v-if="$v.userInfo.password.$error">
          <span v-if="!$v.userInfo.password.required"
            >パスワードが入力されていません。</span
          >
          <span v-if="!$v.userInfo.password.minLength"
            >10文字以上が必要です</span
          >
          <span v-if="!$v.userInfo.password.maxLength"
            >30字以内で入力してください</span
          >
          <span v-if="!$v.userInfo.password.email"
            >英数字でパスワードを入力してください</span
          >
        </div>
      </div>

      <div class="form-group">
        <input
          type="password"
          placeholder="パスワードの確認"
          v-model="repeatPassword"
          @blur="$v.repeatPassword.$touch()"
          :class="{ error: $v.repeatPassword.$error }"
        />
        <div v-if="$v.repeatPassword.$error">
          <span v-if="!$v.repeatPassword.required"
            >パスワードの確認をしてください</span
          >
          <span v-if="!$v.repeatPassword.sameAs"
            >入力されたパスワードと異なります</span
          >
        </div>
      </div>

      <div class="form-group">
        <input
          type="text"
          placeholder="ニックネーム"
          v-model="userInfo.username"
          @blur="$v.userInfo.username.$touch()"
          :class="{ error: $v.userInfo.username.$error }"
        />
        <div v-if="$v.userInfo.username.$error">
          <span v-if="!$v.userInfo.username.required"
            >ユーザー名が入力されていません。</span
          >
          <span v-if="!$v.userInfo.username.maxLength"
            >15字以内で入力してください</span
          >
        </div>
      </div>
    </div>

    <button @click="signUp">登録</button>
    <p>
      既にアカウントを持っていますか？<br />
      <router-link to="/signin">サインインはこちら</router-link>
    </p>
    <p>{{ userInfo.email }}</p>
  </div>
</template>

<script>
import sanitaizeMethod from "@/myModules/sanitize";
import router from "@/router/index";
import {
  required,
  maxLength,
  minLength,
  alphaNum,
  email,
  sameAs,
} from "vuelidate/lib/validators";

//firebase authの設定
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

//firebase firestoreの設定
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

const db = firebase.firestore();

export default {
  data() {
    return {
      userInfo: {
        email: "",
        password: "",
        username: "",
      },
      repeatPassword: "",
    };
  },
  validations: {
    userInfo: {
      email: { required, email, maxLength: maxLength(40) },
      password: {
        required,
        alphaNum,
        minLength: minLength(10),
        maxLength: maxLength(30),
      },
      username: { required, maxLength: maxLength(15) },
    },
    repeatPassword: {
      required,
      sameAs: sameAs(function () {
        return this.userInfo.password;
      }),
    },
  },
  methods: {
    signUp: function () {
      //入力内容のエスケープ
      this.userInfo.email = sanitaizeMethod(this.userInfo.email);
      this.userInfo.password = sanitaizeMethod(this.userInfo.password);
      this.userInfo.username = sanitaizeMethod(this.userInfo.username);
      //ユーザー登録
      this.signUpMethod(
        this.userInfo.email,
        this.userInfo.password,
        this.userInfo.username
      );
    },
    //firebase authによるユーザー新規作成
    //email, password, username
    signUpMethod: function (email, password, username) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        alert("バリデーションエラー");
      } else {
        alert("seccusess");
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user; // eslint-disable-line no-unused-vars
            console.log(user);
            //ユーザー名の登録
            updateProfile(auth.currentUser, {
              displayName: username,
            })
              .then(() => {
                // Profile updated!
              })
              .catch((error) => {
                console.log(error);
              });
            //ユーザー情報をデータベースに送信
            const sendUserInfo = db.collection("users").doc(user.uid).set(
              { userName: username, email: email, userId: user.uid }, //createdAt:timestamp
              { merge: true }
            );
            sendUserInfo
              .then(() => {
                console.log("seccusessfully uproaded");
              })
              .catch((error) => {
                console.log(error);
              });
            alert("登録されたメールアドレスから、登録を完了して下さい。");
            sendEmailVerification(auth.currentUser).then(() => {
              // Email verification sent
            });
            //ユーザー登録成功後にメールアドレス確認ページへ
            router.push("/Emailvelify");
          })
          .catch((error) => {
            alert(error.message);
            alert(error.code);
          });
      }
    },
  },
};
</script>
