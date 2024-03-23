# 图片预览功能，兼容移动端单指拖动，双指缩放功能 

picture-preview-vue

![](./pic.png)

[Demo](https://liuzhenghe30265.github.io/picture-preview-vue)

[Github](https://github.com/liuzhenghe30265/picture-preview-vue.git)

## Install

```bash
npm install --save picture-preview-vue
```

## Usage

```js
import PicturePreviewVue from 'picture-preview-vue'

// 预览单张图片
PicturePreviewVue('https://file.iviewui.com/images/image-demo-2.jpg')


// 预览多张图片
PicturePreviewVue({
  url: 'https://file.iviewui.com/images/image-demo-2.jpg',
  urlList: [
    'https://file.iviewui.com/images/image-demo-1.jpg',
    'https://file.iviewui.com/images/image-demo-2.jpg',
    'https://file.iviewui.com/images/image-demo-3.jpg',
    'https://file.iviewui.com/images/image-demo-4.jpg',
    'https://file.iviewui.com/images/image-demo-5.jpg',
    'https://file.iviewui.com/images/image-demo-6.jpg'
  ] // 当前图片所在列表
})
```

PicturePreviewVue 方法接收一个参数，字符串或对象：

- 字符串，必须传入一个 url 地址；
- 对象，url 传入当前图片地址，urlList 传入当前图片所在列表数据。

预览时，可以使用键盘 ←、→ 切换图片，↑、↓ 缩放图片，Space 显示 1:1 图片，ESC 退出预览。

[使用示例](https://github.com/liuzhenghe30265/picture-preview-vue/blob/main/examples/App.vue)
