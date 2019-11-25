

<template>
  <div>
    <the-nav></the-nav>
    <div>这是m3</div>
    <button @click="go(4)">下一页</button>
  </div>
</template>
<script>


import Vue from 'vue';
import axios from 'axios';
import theNav from './theNav.vue'

import util from '../util.js'

export default {
  mixins: [util],
  data() {
    return {
    };
  },
  async mounted() {
  },
  methods: {
    
  },
  components: {
    theNav
  }
};
</script>
<style>

</style>


