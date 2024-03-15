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
const isObject = function (obj) {
  return obj !== null && typeof obj === 'object'
}

const MessageConstructor = Vue.extend(Main)

let instance
const instances = []
let seed = 1

const ImagePreviewDOM = function (options) {
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  const userOnClose = options.onClose
  const id = 'message_' + seed++

  options.onClose = function () {
    ImagePreviewDOM.close(id, userOnClose)
  }
  instance = new MessageConstructor({
    data: options
  })
  instance.id = id
  if (isVNode(instance.dom)) {
    instance.$slots.default = [instance.dom]
    instance.dom = null
  }
  instance.$mount()
  document.body.appendChild(instance.$el)
  let verticalOffset = options.offset || 20
  if (options.accVerticalOffset) {
    // 累计垂直偏移量
    instances.forEach(item => {
      verticalOffset += item.$el.offsetHeight + 16
    })
  }
  instance.verticalOffset = verticalOffset
  instance.visible = true
  instance.$el.style.zIndex = options.zIndex || 999

  instances.push(instance)
  return instance
}

  ;['success', 'warning', 'info', 'error'].forEach(type => {
    ImagePreviewDOM[type] = options => {
      if (isObject(options) && !isVNode(options)) {
        return ImagePreviewDOM({
          ...options,
          type
        })
      }
      return ImagePreviewDOM({
        type,
        message: options
      })
    }
  })

ImagePreviewDOM.close = function (id, userOnClose) {
  const len = instances.length
  let index = -1
  let removedHeight
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight
      index = i
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return
  for (let i = index; i < len - 1; i++) {
    const dom = instances[i].$el
    dom.style['top'] =
      parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px'
  }
}

ImagePreviewDOM.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default ImagePreviewDOM