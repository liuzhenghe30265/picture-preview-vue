<template>
  <div>
    PicturePreviewVue
  </div>
</template>

<script>
export default {
  name: 'PicturePreviewVue',

  components: {},

  props: {
    name: {
      type: String,
      default: ''
    },
    obj: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {}
}
</script>

<style lang='scss' scoped>
</style>