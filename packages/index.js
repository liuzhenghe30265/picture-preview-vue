import PicturePreviewVue from './PicturePreviewVue/index'

const components = [
  PicturePreviewVue
]

const install = function (Vue) {
  if (install.installed) return
  components.map(component => Vue.component(component.name, component))
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default {
  install,
  PicturePreviewVue
}
