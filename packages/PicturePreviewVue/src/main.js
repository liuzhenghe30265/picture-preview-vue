import Vue from 'vue'
import Main from './main.vue'
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
function isVNode(node) {
  return (
    node !== null &&
    typeof node === 'object' &&
    hasOwn(node, 'componentOptions')
  )
}

const _Constructor = Vue.extend(Main)

let instance
const instances = []

const ImagePreviewDOM = function (options) {
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {}
  }
  instance = new _Constructor({
    data: options
  })
  if (isVNode(instance.dom)) {
    instance.$slots.default = [instance.dom]
    instance.dom = null
  }
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true

  instances.push(instance)
  return instance
}

ImagePreviewDOM.close = function (id, userOnClose) {
  const len = instances.length
  let index = -1
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      index = i
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return
}

ImagePreviewDOM.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default ImagePreviewDOM