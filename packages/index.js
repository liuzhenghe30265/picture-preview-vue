import ImagePreview from './PicturePreviewVue'

export function ImagePreviewUtil({
  ...rest
}) {
  return ImagePreview({
    ...rest
  })
}

export default function PicturePreviewVue(data) {
  let _data = data
  if (Object.prototype.toString.call(data) === '[object String]') {
    // ^ 仅传入一个地址
    _data = {
      urlList: [_data],
      initialIndex: 0
    }
  }
  ImagePreviewUtil(_data)
}