import Taro from '@tarojs/taro'
import setting from './setting'

async function doRequest ({baseUrl = setting.apiUrl ,url, method = 'GET', data = null}) {
  console.log(setting.openid)
  const loadingShow = await Taro.showLoading({title: ''})
  const header = setting.openid ? { 'content-type': 'application/json', 'openid': setting.openid }
  :  { 'content-type': 'application/json' }
  if (loadingShow) {
    let res
    if (data) {
      res = await Taro.request({
        url: `${baseUrl}/${url}`,
        method: method,
        header,
        data: data
      })
    } else {
      res = await Taro.request({
        url: `${baseUrl}/${url}`,
        header,
        method: method
      })
    }
    if (res) {
      Taro.hideLoading()
      if (res.statusCode === 200) {
        return res
      } else {
        Taro.showModal({
          title: '提示',
          showCancel: false,
          content: res.errMsg
        })
      }
    }
  }
}
async function pay (url, data, page=1) {
  const res = await doRequest({
    url: url,
    method: 'POST',
    data: data
  })
  if (res.data.return_msg === 'OK') {
    if (res.data.trade_type === 'NOFEE') {
      Taro.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 1200
      })
      setTimeout(() => {
        Taro.navigateBack({delta:page})
      }, 1200)
    } else {
      const payres = await Taro.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonce_str,
        package: `prepay_id=${res.data.prepay_id}`,
        signType: 'MD5',
        paySign: res.data.sign
      })
      if (payres.errMsg === 'requestPayment:ok') {
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1200
        })
        setTimeout(() => {
          Taro.navigateBack({delta:page})
        }, 1200)
      } else {
        Taro.showToast({
          title: '支付失败',
          icon: 'error',
          duration: 1200
        })
      }
    }
  } else {
    Taro.showToast({
      title: '支付繁忙，稍后再试',
      icon: 'error',
      duration: 2000
    })
  }
}
export {doRequest, pay}
