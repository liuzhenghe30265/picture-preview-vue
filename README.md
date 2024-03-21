# 图片预览功能，兼容移动端单指拖动，双指缩放功能 

picture-preview-vue 

![]()

[Demo](https://liuzhenghe30265.github.io/picture-preview-vue )

[Github](https://github.com/liuzhenghe30265/picture-preview-vue.git)

## Install

```bash
npm install --save picture-preview-vue
```

## Usage


```js
import PicturePreviewVue from 'picture-preview-vue'

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
  initialIndex: 0
})
```

[使用示例](https://github.com/liuzhenghe30265/picture-preview-vue/blob/main/examples/App.vue)
