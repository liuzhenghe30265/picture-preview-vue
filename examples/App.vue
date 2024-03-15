<template>
  <div id="app">
    <img
      class="pic"
      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      alt=""
      @click="handleClick"
    >
  </div>
</template>

<script>
import PicturePreviewVue from '../packages/index'
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
      PicturePreviewVue({
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
}
.pic {
  width: 200px;
  cursor: pointer;
}
</style>
