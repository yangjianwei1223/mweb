import Exif from 'exif-js'
import apiport from './api'
import qs from 'qs'
import http from './http.js'

// 上传图片前处理大小旋转
function ZipAndUploadImg (ele, imgpath, sunfun, failfun) {
  console.log(ele)
  let imgfiles = ele.target.files || ele.dataTransfer.files
  let rFilter = /^(image\/jpeg|image\/png)$/i // 检查图片格式
  let MaximgW = 1000
  let Orientation
  let filevalue = imgfiles[0]
  if (!imgfiles.length) return false
  if (!rFilter.test(filevalue.type)) {
    return false
  }
  Exif.getData(filevalue, function () {
    Orientation = Exif.getTag(this, 'Orientation')
  })
  if (!Orientation) {
    Orientation = 1
  }
  // 看支持不支持FileReader
  if (!filevalue || !window.FileReader) return false
  console.log('照片角度', Orientation)
  ele.target.value = ''
  let reader = new FileReader()
  reader.readAsDataURL(filevalue)
  reader.onloadend = function () {
    let result = this.result
    let img = new Image()
    img.src = result
    console.log(result, 'base64')
    if (img.width > MaximgW) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = MaximgW
      canvas.height = MaximgW * (img.height / img.width)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      result = canvas.toDataURL('image/jpeg', 0.8)
    }
    result = result.substr(23)
    uploadImg(result, imgpath, 1, Orientation, sunfun, failfun)
  }
}
// 上传图片
function uploadImg (base64str, imgPath, imgType, orientation, sucfun, failfun) {
  let model = {
    base64: base64str,
    path: imgPath,
    imgType: imgType,
    Orientation: orientation
  }
  http({
    url: apiport.Common_PicFileSave,
    method: 'post',
    data: qs.stringify({ reqJson: JSON.stringify(model) })
  }).then((res) => {
    console.log('图片上传成功', res)
    if (typeof sucfun === 'function') {
      sucfun(res.data)
    }
  }).catch((error) => {
    console.log(error)
    if (typeof failfun === 'function') {
      failfun(error)
    }
  })
}
export {
  ZipAndUploadImg,
  uploadImg
}
