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
      <span class="iconfont icon-guanbi-tupianyulan" />
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
          @touchstart="handleMouseDownMobile"
          @touchend="handleMouseUpMobile"
        >
      </div>
      <div class="image_preview_actions">
        <div class="image_preview_actions_inner">
          <span
            class="iconfont icon-tupianyulan-suoxiao"
            @click="handleActions('zoomOut')"
          />
          <span
            class="iconfont icon-tupianyulan-fangda"
            @click="handleActions('zoomIn')"
          />
          <span
            class="iconfont"
            :class="mode.name === 'contain' ? 'icon-tupianyulan-zhengchangbili' : 'icon-tupianyulan-1bi1'"
            @click="toggleMode"
          />
          <span
            class="iconfont icon-tupianyulan-zuoxuanzhuan"
            @click="handleActions('anticlocelise')"
          />
          <span
            class="iconfont icon-tupianyulan-youxuanzhuan"
            @click="handleActions('clocelise')"
          />
        </div>
      </div>
      <div
        v-if="urlList.length > 1"
        class="image_preview_toggle"
      >
        <span
          class="iconfont icon-a-tupianyulan-zuoqie image_preview_toggle_btn image_preview_toggle_btn_prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        />
        <span
          class="iconfont icon-a-tupianyulan-youqie image_preview_toggle_btn image_preview_toggle_btn_next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        />
      </div>
    </div>
  </div>
</template>

<script>
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
      imgTop: 0,
      imgLeft: 0,
      imgScale: 1,
      mobileScale: 0, // 手指离开时图片的缩放比例
      clientX: 0,
      clientY: 0,
      start: [{}, {}],
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
    currentImg() {
      this.$nextTick(() => {
        const $img = this.$refs.img[0]
        if (!$img.complete) {
          this.loading = true
        }
      })
    },
    index: {
      handler: function () {
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
        window.requestAnimationFrame(() => {
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
    handleImgLoad() {
      this.loading = false
    },
    handleImgError(e) {
      this.loading = false
      e.target.alt = '加载失败'
    },
    // 缩放，勾股定理方法-求两点之间的距离
    getDistance(p1, p2) {
      const x = p2.pageX - p1.pageX
      const y = p2.pageY - p1.pageY
      return Math.sqrt(x * x + y * y)
    },
    // 图片缩放
    scaleFunc(num, bool) {
      if (this.imgScale <= 0.2 && num < 0) return
      if (bool) {
        this.imgScale = num
      } else {
        this.imgScale += num
      }
      this.transform.scale = this.imgScale
    },
    // 手指拖动
    moveFuncMobile(e) {
      e = e || window.event
      if (e.touches.length > 1) {
        const now = e.touches
        const scale =
          this.getDistance(now[0], now[1]) /
          this.getDistance(this.start[0], this.start[1])
        // 判断是否手指缩放过，如果缩放过，要在上次缩放的比例基础上进行缩放
        if (this.mobileScale) {
          if (scale > 1) {
            // 放大
            this.scaleFunc(scale + this.mobileScale - 1, true)
          } else {
            // 缩小
            this.scaleFunc(scale * this.mobileScale, true)
          }
        } else {
          this.scaleFunc(scale, true)
        }
      } else {
        const touch = e.touches[0]
        e.preventDefault()
        const movementX = touch.pageX - this.clientX
        const movementY = touch.pageY - this.clientY
        this.imgLeft += movementX * 2
        this.imgTop += movementY * 2
        this.clientX = touch.pageX
        this.clientY = touch.pageY
        this.transform.offsetX = this.imgLeft
        this.transform.offsetY = this.imgTop
      }
    },
    // 手指抬起
    handleMouseUpMobile() {
      this.$refs.img[0].ontouchmove = null
      this.mobileScale = this.imgScale
    },
    // 手指按下
    handleMouseDownMobile(e) {
      e.preventDefault()
      e = e || window.event
      if (e.touches.length > 1) {
        this.start = e.touches
      } else {
        this.clientX = e.touches[0].pageX
        this.clientY = e.touches[0].pageY
      }
      // 添加手指拖动事件
      this.$refs.img[0].ontouchmove = this.moveFuncMobile
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
      on(document, 'mouseup', () => {
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

<style>
@font-face {
  font-family: 'iconfont';
  src: url('./font/iconfont.ttf') format('truetype');
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-guanbi-tupianyulan:before {
  content: '\e628';
}

.icon-tupianyulan-suoxiao:before {
  content: '\e8ac';
}

.icon-tupianyulan-fangda:before {
  content: '\e8ad';
}

.icon-a-tupianyulan-youqie:before {
  content: '\e828';
}

.icon-a-tupianyulan-zuoqie:before {
  content: '\e829';
}

.icon-tupianyulan-youxuanzhuan:before {
  content: '\e667';
}

.icon-tupianyulan-1bi1:before {
  content: '\e668';
}

.icon-tupianyulan-zhengchangbili:before {
  content: '\e669';
}

.icon-tupianyulan-zuoxuanzhuan:before {
  content: '\e66a';
}
</style>
<style lang="scss">
.image_preview_container {
  position: fixed;
  z-index: 999;
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
    span {
      font-size: 18px;
      padding: 10px;
      cursor: pointer;
      color: #ffffff;
      border-radius: 50%;
      background-color: #606266;
    }
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
        padding: 10px 4px;
        border-radius: 20px;
        background-color: #606266;
        span {
          font-size: 24px;
          font-weight: bold;
          margin: 0 10px;
          cursor: pointer;
          color: #ffffff;
        }
      }
    }
    .image_preview_toggle {
      user-select: none;
      .image_preview_toggle_btn {
        font-size: 32px;
        position: absolute;
        top: 50%;
        padding: 6px;
        cursor: pointer;
        color: #ffffff;
        border-radius: 50%;
        background-color: #606266;
        &.image_preview_toggle_btn_prev {
          left: 40px;
          transform: translateY(-50%);
        }
        &.image_preview_toggle_btn_next {
          right: 40px;
          transform: translateY(-50%);
        }
        &.is-disabled {
          cursor: not-allowed;
          opacity: 0.25;
        }
      }
    }
  }
}
</style>
