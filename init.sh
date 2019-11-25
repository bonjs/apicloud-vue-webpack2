#/bin/sh

count=${1};

rm -rf ./src/components/m*
rm -rf ./src/entry/m*


for((i = 1; i <= $count; i++))
do
	echo "
import App from '../components/m$i.vue';
import init from '../init.js'

init(App);

/*
if(module.hot) {
	module.hot.accept();
}
*/

" > ./src/entry/m$i.js

	echo "

<template>
  <div>
    <the-nav></the-nav>
    <div>这是m$i</div>
    <button @click=\"go($(($i+1)))\">下一页</button>
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

" > ./src/components/m$i.vue
done
