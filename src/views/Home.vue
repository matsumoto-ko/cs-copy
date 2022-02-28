<template>
  <div>
    <div class="search-menus">
      <!------------------------------------------>
      <div class="search-menu">
        <button class="button" @click="show1 = !show1">
          コーヒー豆を登録する
        </button>
        <div class="hidden" v-if="show1">
          <router-link to="/searchNearShopsByMap" class="link"
            >近くの店舗から登録</router-link
          >

          <router-link to="/searchNearShopsByWord" class="link"
            >店舗を検索して登録</router-link
          >
        </div>
      </div>
      <!------------------------------------------->
      <div class="search-menu">
        <button class="button" @click="show2 = !show2">
          店舗の豆品種をみる
        </button>
        <div class="hidden" v-if="show2">
          <router-link to="/searchshopsLineUpByMap" class="link"
            >近くの店舗から検索</router-link
          >
        </div>
        <div class="hidden" v-if="show2">
          <router-link to="/searchShopsLineUpByShopsName" class="link"
            >店舗を検索して探す</router-link
          >
        </div>
      </div>
      <!------------------------------------------->
      <div class="search-menu">
        <button class="button" @click="show3 = !show3">
          コーヒー豆を品種で探す
        </button>
        <div class="hidden" v-if="show3">
          <router-link to="/searchBeansVariety" class="link"
            >品種から探す</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data: function () {
    return {
      show1: false,
      show2: false,
      show3: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/_variables.scss";

.button {
  @include button(25%);
}

.hidden {
  .link {
    display: block;
    margin: 15px auto 0 auto;
    padding: 5px 0;
    width: 25%;
    color: $sub-color;
    background-color: $background-color;
    text-decoration: none;
    opacity: 1;
    &:active {
      opacity: 0.6;
    }
  }
}

@media (max-width: $tablet-breakpoint) {
  .button {
    @include button(80%);
  }
  .hidden {
    .link {
      width: 80%;
    }
  }
}
</style>
