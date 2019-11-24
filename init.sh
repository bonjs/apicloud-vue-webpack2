#/bin/sh

count=${1};

rm -rf ./src/components/m*
rm -rf ./src/entry/m*


for((i = 1; i <= $count; i++))
do
	echo "
import Vue from 'vue';
import app from '../components/m$i.vue'

new Vue({
	el: '#app',
	render: function (h) {
		return h(app)
	}
})
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
    <div> 这是m$i</div>
    <button @click=\"go()\"> 下一页</button>
  </div>
</template>
<script>


import Vue from 'vue';
import axios from 'axios';
import theNav from './theNav.vue'

import vconsole from 'vconsole'

new vconsole();

export default {
  data() {
    return {
    };
  },
  async mounted() {
  },
  methods: {
    go() {
      //window.location.href = \"./m$(($i+1)).html\";
      //return;
      if (window.api) {
        api.openWin({
          name: \"m$(($i+1))\",
          url: \"./m$(($i+1)).html\"
        });
      } else {
        window.location.href = \"./m$(($i+1)).html\"
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

" > ./src/components/m$i.vue
done
