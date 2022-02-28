import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged, // eslint-disable-line no-unused-vars
} from "firebase/auth";
import router from "@/router/index";

//firebase authntication のユーザー登録の処理
const signUpMethod = function (email, password, username) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user; // eslint-disable-line no-unused-vars
      //ユーザー登録をメールで完了させる
      alert("登録されたメールアドレスから、登録を完了して下さい。");
      sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent
      });
      //ユーザー登録成功後にログインページへ
      router.push("/signin");
      console.log(username);
    })
    .catch((error) => {
      alert(error.message);
      alert(error.code);
    });
};

//ログインする処理
const signInMethod = function (email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user; // eslint-disable-line no-unused-vars
      router.push("/home");
    })
    .catch((error) => {
      alert(error.message);
      alert(error.code);
    });
  console.log(auth.currentUser);
};

//ログアウトする処理
const signOutMethod = async function () {
  const auth = getAuth();
  await signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      alert(error.message);
      alert(error.code);
    });
};

//ユーザー情報を取る処理
const getUserInfoMethod = function () {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    console.log(user);
    // The user object has basic properties such as display name, email, etc.

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
  }
};

export default signUpMethod;
signInMethod;
signOutMethod;
getUserInfoMethod;
