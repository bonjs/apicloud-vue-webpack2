


<template>
  <div>
    <div> 这是nav</div>
    <button @click="close()"> close</button>
    <button @click="reload()">reload</button>
  </div>
</template>
<script>


export default {
  data() {
    return {
    };
  },
  async mounted() {
  },
  methods: {
    close() {
      window.close();
    },
    reload() {
      window.location.reload();
    }
  },
  components: {
  }
};
</script>
<style>
body {
  background: white;
}
</style>


