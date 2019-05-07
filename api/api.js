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
      url: `${app.globalApi.host}${url}` + (undefined !== options.data.rest && null !== options.data.rest ? ('/' + options.data.rest) : ''),
      method: options.method,
      data: options.data.data,
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'LL-Token': token,
        'LL-House': app.globalData.house.id
      },
      success(request) {
        if (request.statusCode === 401) { 
          wx.showToast({
            title: '登录状态超时，请重新操作',
            icon: 'none'
          })
          app.login()
          return
        }
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

const pay = (total, body='商品购买', detail='') => {
  return new Promise((resolve, reject) => {
    let userInfo = app.globalData.userInfo
    if (null === userInfo || undefined === userInfo || null === userInfo.mine || undefined === userInfo.mine) {
      wx.showToast({
        title: '请先完成登录',
        icon: 'none'
      })
      return false
    }
    createPay(total, body, detail).then(res => {
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.sign,
        success(res) {
          if (res.errMsg === 'requestPayment:ok') { resolve(res) }
          else { reject(res) }
        },
        fail(err) { 
          wx.showToast({
            title: '支付失败，请重试或联系客服',
            icon: 'none'
          })
          reject(res)
        }
      })
    }).catch(err => {
      wx.showToast({
        title: '发起支付失败，请重试或联系客服',
        icon: 'none'
      })
      reject(res)
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

const addCart = (goods_code, amount = 1) => {
  return request(app.globalApi.cart_add + '/' + goods_code + '/' + amount, { method: 'POST', data: {} })
}

const touchCart = (cart_code, amount = 1) => {
  return request(app.globalApi.cart_touch + '/' + cart_code + '/' + amount, { method: 'POST', data: {} })
}

const countCart = () => {
  return request(app.globalApi.cart_count, { method: 'GET', data: {} })
}

const checkedCart = (cart_codes, state = 1, all_pick = 3) => {
  return request(app.globalApi.cart_checked + '/' + state + '/' + all_pick, { method: 'POST', data: { data: { cart_codes: cart_codes } } })
}

const delCart = (cart_codes) => {
  return request(app.globalApi.cart_del, { method: 'POST', data: { data: { cart_codes: cart_codes } } })
}

const delCartChceked = () => {
  return request(app.globalApi.cart_del_checked, { method: 'POST', data: { } })
}

const addAddr = (receive_name, phone, type, city_code, city, address, location, district, lat, lng, title) => {
  return request(app.globalApi.add_addr, { method: 'POST', data: { data: {
    title: title,
    receive_name: receive_name,
    phone: phone,
    city_code: city_code,
    city: city,
    district: district,
    address: address,
    location: location,
    address_type: type,
    lat: lat,
    lng: lng
  }
  } })
}

const modifyAddr = (address_code, receive_name, phone, type, city_code, city, address, location, district, lat, lng, title) => {
  return request(app.globalApi.modify_addr + '/' + address_code, {
    method: 'POST', data: { data: {
      title: title,
      receive_name: receive_name,
      phone: phone,
      city_code: city_code,
      city: city,
      district: district,
      address: address,
      location: location,
      address_type: type,
      lat: lat,
      lng: lng
    }
  }})
}

const getAddr = (address_code) => {
  return request(app.globalApi.get_addr + '/' + address_code, { method: 'GET', data: {} })
}

const firstAddr = (address_code) => {
  return request(app.globalApi.first_addr, { method: 'GET', data: {} })
}

const nearAddr = (house_id) => {
  return request(app.globalApi.near_addr + '/' + house_id, { method: 'GET', data: {} })
}

const queryAddr = () => {
  return request(app.globalApi.query_addr, { method: 'GET', data: {} })
}

const delAddr = (address_code) => {
  return request(app.globalApi.del_addr + '/' + address_code, { method: 'POST', data: {} })
}

const vipPlans = () => {
  return request(app.globalApi.vip_plans, { method: 'GET', data: {} })
}

const vipOpen = (month) => {
  return request(app.globalApi.vip_open + '/' + month, { method: 'POST', data: {} })
}

const getUser = () => {
  return request(app.globalApi.get_user, { method: 'GET', data: {} })
}

const createPay = (total, body='商品购买', detail='') => {
  return request(app.globalApi.create_pay, { method: 'POST', data: { data: { total: total, body: '轻果鲜生-' + body, detail: detail } } })
}

module.exports = {
  get,
  post,
  put,
  remove,
  addCart,
  touchCart,
  checkedCart,
  countCart,
  addAddr,
  delCart,
  delCartChceked,
  modifyAddr,
  getAddr,
  queryAddr,
  delAddr,
  firstAddr,
  nearAddr,
  vipPlans,
  vipOpen,
  getUser,
  createPay,
  pay
}