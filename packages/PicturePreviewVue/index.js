import PicturePreviewVue from './src/index'

PicturePreviewVue.install = function (Vue) {
  Vue.component(PicturePreviewVue.name, PicturePreviewVue)
}
export default PicturePreviewVue
