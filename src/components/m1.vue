
<template>
  <div>
    <the-nav></the-nav>
    <div>这是m1</div>
    <button @click="go()">下一页</button>
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import theNav from "./theNav.vue";


export default {
  data() {
    return {};
  },
  created() {},
  async mounted() {},
  methods: {
    go() {
      //window.location.href = "./m2.html";
      //return;
      if (window.api) {
        api.openWin({
          name: "m2",
          url: "./m2.html"
        });
      } else {
        window.location.href = "./m2.html";
      }
    }
  },
  components: {
    theNav
  }
};
</script>
<style>
</style>


