import ImagePreview from './PicturePreviewVue'

export function ImagePreviewUtil({
  ...rest
}) {
  return ImagePreview({
    ...rest
  })
}

export default function PicturePreviewVue(data) {
  ImagePreviewUtil(data)
}