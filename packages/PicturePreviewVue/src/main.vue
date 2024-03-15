<template>
  <div
    v-show="visible"
    class="image_preview_container"
  >
    <div class="image_preview_mask"></div>
    <img
      :src="url"
      alt=""
    >
    <div
      class="image_preview_close"
      @click="close"
    >
      x
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  data() {
    return {
      visible: false,
      closed: false
    }
  },

  computed: {},

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.handleAfterLeave()
      }
    }
  },
  mounted() {},
  beforeDestroy() {},

  methods: {
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    close() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose(this)
      }
    }
  }
}
</script>

<style lang="scss">
.image_preview_container {
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  &::before {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    opacity: 0.5;
    background: #000000;
  }
  img {
    width: 100px;
    height: 100px;
  }
  .image_preview_close {
    font-size: 24px;
    position: absolute;
    z-index: 999;
    top: 50px;
    right: 50px;
    cursor: pointer;
  }
}
</style>
