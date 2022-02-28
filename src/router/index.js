import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/setUpViews/Signup";
import Signin from "../views/setUpViews/Signin";
import Header from "../views/Header";
import Emailvelify from "../views/setUpViews/Emailvelify";

//位置情報、データ取得関係
import searchNearShopsByMap from "../views/searchCoffeeShopsViews/searchNearShopsByMap";
import searchNearShopsByWord from "../views/searchCoffeeShopsViews/searchNearShopsByWord";
import searchShopsLineUpByMap from "../views/searchShopsLineUpViews/searchShopsLineUpByMap";
import searchShopsLineUpByShopsName from "../views/searchShopsLineUpViews/searchShopsLineUpByShopsName";
import searchBeansVariety from "../views/searchBeansVarietyViews/searchBeansVariety";
import { getAuth, onAuthStateChanged } from "firebase/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "signin",
  },
  {
    path: "/home",
    name: "Home",
    components: {
      default: Home,
      header: Header,
    },
    //meta: { requiresAuth: true },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/header",
    name: "header",
    component: Header,
  },
  {
    path: "/emailvelify",
    name: "emailvelify",
    component: Emailvelify,
  },
  {
    path: "/searchNearShopsByMap",
    name: "searchNearShopsByMap",
    component: searchNearShopsByMap,
  },
  {
    path: "/searchNearShopsByWord",
    name: "searchNearShopsByWord",
    component: searchNearShopsByWord,
  },
  {
    path: "/searchShopsLineUpByMap",
    name: "searchShopsLineUpByMap",
    component: searchShopsLineUpByMap,
  },
  {
    path: "/searchShopsLineUpByShopsName",
    name: "searchShopsLineUpByShopsName",
    component: searchShopsLineUpByShopsName,
  },
  {
    path: "/searchBeansVariety",
    name: "searchBeansVariety",
    component: searchBeansVariety,
  },
];

const router = new VueRouter({
  routes,
});

//ログインしていないユーザーが見れないページの設定
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    // 認証状態を取得
    const auth = getAuth();
    onAuthStateChanged(auth, function (user) {
      if (user) {
        if (user.emailVerified) {
          next();
        } else {
          next({ name: "emailvelify" });
        }
      } else {
        // 認証されていない場合、認証画面へ
        next({ name: "Signin" });
      }
    });
  } else {
    next();
  }
});

export default router;
