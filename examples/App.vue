<template>
  <div id="app">
    <img
      class="pic"
      src="https://file.iviewui.com/images/image-demo-1.jpg"
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
      // PicturePreviewVue(
      //   'https://file.iviewui.com/images/image-demo-1.jpg'
      // )
      PicturePreviewVue({
        urlList: [
          'https://file.iviewui.com/images/image-demo-1.jpg',
          'https://file.iviewui.com/images/image-demo-2.jpg',
          'https://file.iviewui.com/images/image-demo-3.jpg',
          'https://file.iviewui.com/images/image-demo-4.jpg',
          'https://file.iviewui.com/images/image-demo-5.jpg',
          'https://file.iviewui.com/images/image-demo-6.jpg'
        ],
        initialIndex: 2
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
