<template>
  <div id="app">
    <input
      type="button"
      value="click"
      @click="handleClick"
    >
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {}
  },
  mounted() {},
  computed: {},
  methods: {
    handleClick() {
      this.$PicturePreviewVue()
    }
  }
}
</script>

<style lang="scss">
#app {
  padding: 0 50px;
  margin: 100px auto;
}
</style>
