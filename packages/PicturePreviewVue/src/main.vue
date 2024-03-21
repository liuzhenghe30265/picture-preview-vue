<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for -->
  <div
    v-show="visible"
    class="image_preview_container"
  >
    <div
      class="image_preview_close"
      @click="close"
    >
      x
    </div>
    <div
      ref="imagePreviewWrapper"
      tabindex="-1"
      class="image_preview_wrapper"
    >
      <div class="image_preview_canvas">
        <img
          v-for="(url, i) in urlList"
          v-if="i === index"
          ref="img"
          :key="url"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
        >
      </div>
      <div class="image_preview_actions">
        <div class="image_preview_actions_inner">
          <span @click="handleActions('zoomOut')">
            zoomOut
          </span>
          <span @click="handleActions('zoomIn')">
            zoomIn
          </span>
          <span
            :class="mode.name"
            @click="toggleMode"
          >
            mode
          </span>
          <span @click="handleActions('anticlocelise')">
            anticlocelise
          </span>
          <span @click="handleActions('clocelise')">
            clocelise
          </span>
        </div>
      </div>
      <div class="image_preview_toggle">
        <span
          class="image_preview_toggle_btn image_preview_toggle_btn_prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        >
          prev
        </span>
        <span
          class="image_preview_toggle_btn image_preview_toggle_btn_next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        >
          next
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
const isServer = Vue.prototype.$isServer
const Mode = {
  CONTAIN: {
    name: 'contain'
  },
  ORIGINAL: {
    name: 'original'
  }
}

const isFirefox = function () {
  return (
    !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i)
  )
}
const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export default {
  data() {
    return {
      index: null,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      mode: Mode.CONTAIN,
      infinite: true,
      loading: false,
      visible: false,
      closed: false
    }
  },

  computed: {
    isSingle() {
      return this.urlList.length <= 1
    },
    isFirst() {
      return this.index === 0
    },
    isLast() {
      return this.index === this.urlList.length - 1
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      }
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%'
      }
      return style
    },
    currentImg() {
      return this.urlList[this.index]
    }
  },

  watch: {
    currentImg(val) {
      this.$nextTick(_ => {
        const $img = this.$refs.img[0]
        if (!$img.complete) {
          this.loading = true
        }
      })
    },
    index: {
      handler: function (val) {
        this.reset()
      }
    },
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.handleAfterLeave()
      }
    }
  },
  mounted() {
    this.index = this.initialIndex
    this.deviceSupportInstall()

    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs['imagePreviewWrapper'].focus()
  },
  beforeDestroy() {},

  methods: {
    rafThrottle(fn) {
      let locked = false
      return function (...args) {
        if (locked) return
        locked = true
        window.requestAnimationFrame(_ => {
          fn.apply(this, args)
          locked = false
        })
      }
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    },
    prev() {
      if (this.isFirst && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index - 1 + len) % len
    },
    next() {
      if (this.isLast && !this.infinite) return
      const len = this.urlList.length
      this.index = (this.index + 1) % len
    },
    toggleMode() {
      if (this.loading) return
      const modeNames = Object.keys(Mode)
      const modeValues = Object.values(Mode)
      const index = modeValues.indexOf(this.mode)
      const nextIndex = (index + 1) % modeNames.length
      this.mode = Mode[modeNames[nextIndex]]
      this.reset()
    },
    handleActions(action, options = {}) {
      if (this.loading) return
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      }
      const { transform } = this
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            )
          }
          break
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
          break
        case 'clocelise':
          transform.deg += rotateDeg
          break
        case 'anticlocelise':
          transform.deg -= rotateDeg
          break
      }
      transform.enableTransition = enableTransition
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
    },
    deviceSupportInstall() {
      this._keyDownHandler = e => {
        e.stopPropagation()
        const keyCode = e.keyCode
        switch (keyCode) {
          // ESC
          case 27:
            this.close()
            break
          // SPACE
          case 32:
            this.toggleMode()
            break
          // LEFT_ARROW
          case 37:
            this.prev()
            break
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case 39:
            this.next()
            break
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut')
            break
        }
      }
      this._mouseWheelHandler = this.rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          })
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          })
        }
      })
      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)
    },
    handleImgLoad(e) {
      this.loading = false
    },
    handleImgError(e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return

      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = this.rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler)
      })

      e.preventDefault()
    },
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
      this.deviceSupportUninstall()
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
  .image_preview_close {
    font-size: 24px;
    position: absolute;
    z-index: 999;
    top: 50px;
    right: 50px;
    cursor: pointer;
    user-select: none;
  }
  .image_preview_wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .image_preview_canvas {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      user-select: none;
    }
    .image_preview_actions {
      position: absolute;
      bottom: 30px;
      left: 50%;
      user-select: none;
      transform: translateX(-50%);
      .image_preview_actions_inner {
        display: flex;
        align-items: center;
        justify-content: space-around;
        span {
          cursor: pointer;
          color: #fff;
        }
      }
    }
    .image_preview_toggle {
      user-select: none;
      .image_preview_toggle_btn {
        position: absolute;
        top: 50%;
        cursor: pointer;
        color: #fff;
        &.image_preview_toggle_btn_prev {
          left: 40px;
          transform: translateY(-50%);
        }
        &.image_preview_toggle_btn_next {
          right: 40px;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
