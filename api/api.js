const app = getApp()
const request = (url, options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    if (null === token || '' === token || undefined === token) {
      wx.showToast({
        title: '登录失败，请重新打开小程序',
        icon: 'none'
      })
      return false;
    }
    wx.request({
      url: `${app.globalApi.host}${url}/` + token,
      method: options.method,
      data: options.params,
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      success(request) {
        if (request.data.state) {
          resolve(request.data.data)
        } else {
          reject(request.data.msg)
        }
      },
      fail(error) {
        reject(error.data.msg)
      }
    })
  })
}

const get = (url, options = {}) => {
  return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}

const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, { method: 'DELETE', data: options })
}

module.exports = {
  get,
  post,
  put,
  remove
}