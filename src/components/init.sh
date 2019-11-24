#/bin/sh

count=${1};

rm -rf ./m*
for((i = 1; i <= $count; i++))
do
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
      return;
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

" > m$i.vue
done
