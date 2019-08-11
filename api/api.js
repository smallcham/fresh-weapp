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

const pay = (order_code) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    if (null === token || '' === token || undefined === token) {
      wx.showToast({
        title: '请先完成登录',
        icon: 'none'
      })
      return false
    }
    createPay(order_code).then(res => {
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
          if (!err.errMsg === 'requestPayment:fail cancel') {
            wx.showToast({
              title: '支付失败，请重试或联系客服',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '支付已取消',
              icon: 'none'
            })
            reject('cancel')
          }
          reject(err)
        }
      })
    }).catch(err => {
      wx.showToast({
        title: '发起支付失败，请重试或联系客服',
        icon: 'none'
      })
      reject(err)
    })
  })
}

const uploadImg = (data = {}, count=1) => {
  const token = wx.getStorageSync('token')
  if (null === token || '' === token || undefined === token) {
    wx.showToast({
      title: '登录失败，请重新打开小程序',
      icon: 'none'
    })
    return false;
  }
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: `${app.globalApi.host}${app.globalApi.upload_img }`, 
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'Content-Type': 'application/json; charset=UTF-8',
            'LL-Token': token,
            'LL-House': app.globalData.house.id
          },
          formData: data,
          success(res) {
            if (res.statusCode === 401) {
              wx.showToast({
                title: '登录状态超时，请重新操作',
                icon: 'none'
              })
              app.login()
              return
            }
            else if (res.statusCode === 413) {
              wx.showToast({
                title: '图片太大，请上传5M以下大小文件',
                icon: 'none'
              })
              return
            }
            let data = JSON.parse(res.data)
            if (data.state) {
              resolve(data.data)
            } else {
              reject(data.msg)
            }
          },
          fail(error) {
            reject(JSON.parse(error.data))
          }
        })
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

const queryGoods = (goods_name, cata_code, page=1) => {
  return request(app.globalApi.query_goods, { method: 'GET', data: { data: { goods_name: goods_name, cata: undefined === cata_code ? '' : cata_code, page: page } } })
}

const recommendGoods = () => {
  return request(app.globalApi.recommend_goods, { method: 'GET', data: {} })
}

const addCart = (goods_code, amount = 1) => {
  return request(app.globalApi.cart_add + '/' + goods_code + '/' + amount, { method: 'POST', data: {} })
}

const getAvailableCart = () => {
  return request(app.globalApi.cart_available_list, { method: 'GET', data: {} })
}

const touchCart = (cart_code, amount = 1) => {
  return request(app.globalApi.cart_touch + '/' + cart_code + '/' + amount, { method: 'POST', data: {} })
}

const cartAgain = (order_code) => {
  return request(app.globalApi.cart_again + '/' + order_code, { method: 'POST', data: {} })
}

const countCart = () => {
  return request(app.globalApi.cart_count, { method: 'GET', data: {} })
}

const checkedCart = (cart_codes, state = 1, all_pick = 3) => {
  return request(app.globalApi.cart_checked + '/' + state + '/' + all_pick, { method: 'POST', data: { data: { cart_codes: cart_codes } } })
}

const deliveryCheck = () => {
  return request(app.globalApi.cart_delivery_check, { method: 'GET', data: { } })
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

const globalNearAddr = (xy) => {
  return request(app.globalApi.global_near_addr + '/' + xy, { method: 'GET', data: {} })
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

const createPay = (order_code) => {
  return request(app.globalApi.create_pay, { method: 'POST', data: { data: { order_code: order_code } } })
}

const createOrder = (day, delivery_time, coupon_ids = []) => {
  let address = app.globalData.selected_address
  if (null === address || undefined === address) {
    wx.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return false
  }
  return request(app.globalApi.create_order, { method: 'POST', data: { data: { day: day, delivery_time: delivery_time, address_code: address.address_code, coupon_ids: coupon_ids } } })
}

const createGroupOrder = (goods_code, group_id = '') => {
  let address = app.globalData.selected_address
  if (null === address || undefined === address) {
    wx.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return false
  }
  return request(app.globalApi.create_group_order + '/' + goods_code + '/' + address.address_code + '/' + group_id, { method: 'POST', data: {} })
}

const createBuyVipOrder = (plan) => {
  return request(app.globalApi.buy_vip_create_order, { method: 'POST', data: { data: { plan: plan } } })
}

const queryOrder = (page = 1, order_state) => {
  let data = { page, page }
  if (undefined !== order_state) data = { page: page, order_state: order_state }
  return request(app.globalApi.query_order, { method: 'GET', data: { data } })
}

const getOrder = (order_code) => {
  return request(app.globalApi.get_order + '/' + order_code, { method: 'GET', data: {} })
}

const feedbackOrder = (order_code, feedback) => {
  return request(app.globalApi.feedback_order + '/' + order_code, { method: 'POST', data: { data: feedback } })
}

const getOrderProgress = (order_code) => {
  return request(app.globalApi.get_order_progress + '/' + order_code, { method: 'GET', data: {} })
}

const cancelOrder = (order_code) => {
  return request(app.globalApi.cancel_order + '/' + order_code, { method: 'POST', data: {} })
}

const getOrderCount = () => {
  return request(app.globalApi.get_order_count, { method: 'GET', data: {} })
}

const autoChooseCoupon = () => {
  return request(app.globalApi.auto_choose_coupon, { method: 'POST', data: {} })
}

const chooseCoupon = (coupon_code) => {
  return request(app.globalApi.choose_coupon + '/' + coupon_code, { method: 'POST', data: {} })
}

const queryEffectiveCoupon = (mode=1) => {
  return request(app.globalApi.query_effective_coupon + '/' + mode, { method: 'GET', data: {} })
}

const countEffectiveCoupon = () => {
  return request(app.globalApi.count_effective_coupon, { method: 'GET', data: {} })
}

const queryCoupon = () => {
  return request(app.globalApi.query_coupon, { method: 'GET', data: {} })
}

const getSearchInfo = () => {
  return request(app.globalApi.search_info, { method: 'GET', data: {} })
}

const clearSearchHis = () => {
  return request(app.globalApi.search_clear, { method: 'POST', data: {} })
}

const getRunData = (iv, edata) => {
  return request(app.globalApi.get_run_data, { method: 'GET', data: { data: { iv: iv, encryptedData: edata } } })
}

const queryCoin = () => {
  return request(app.globalApi.query_coin, { method: 'GET', data: {} })
}

const queryExchangeItem = (type=null) => {
  let param = {}
  if (null !== type) param = { type: type }
  return request(app.globalApi.query_exchange_item, { method: 'GET', data: { data: param } })
}

const exchangeItem = (item_code) => {
  return request(app.globalApi.exchange_item + '/' + item_code, { method: 'POST', data: {} })
}

const getLowerExchangeItem = () => {
  return request(app.globalApi.lower_exchange_item, { method: 'GET', data: { } })
}

const queryRefund = (order_code) => {
  return request(app.globalApi.query_refund + '/' + order_code, { method: 'GET', data: {} })
}

const applyRefund = (order_code, goods_code, amount, reason='', imgs=[]) => {
  return request(app.globalApi.apply_refund + '/' + order_code + '/' + goods_code + '/' + amount, { method: 'POST', data: { data: { reason: reason, imgs: imgs } } })
}

const addQuestion = (type, reason, imgs=[]) => {
  return request(app.globalApi.add_question, { method: 'POST', data: { data: { reason: reason, imgs: imgs, type: type } } })
}

const checkPhone = (iv, encryptedData) => {
  return request(app.globalApi.check_phone, { method: 'POST', data: { data: { iv: iv, data: encryptedData } } })
}

const createRedPaper = (order_code) => {
  return request(app.globalApi.create_red_paper + '/' + order_code, { method: 'POST', data: {} })
}

const getRedPaper = (paper_code) => {
  return request(app.globalApi.get_red_paper + '/' + paper_code, { method: 'GET', data: {} })
}

const takeRedPaper = (paper_code) => {
  return request(app.globalApi.take_red_paper + '/' + paper_code, { method: 'POST', data: {} })
}

const getLocus = (sub_order_code) => {
  return request(app.globalApi.get_locus + '/' + sub_order_code, { method: 'GET', data: {} })
}

const confirmDeliver = (order_code) => {
  return request(app.globalApi.confirm_deliver + '/' + order_code, { method: 'POST', data: {} })
}

const groupBuyQuery = (goods_name = '', next = 1) => {
  return request(app.globalApi.group_buy_query + '/' + goods_name, { method: 'GET', data: { page: next } })
}

const groupBuyInfo = (goods_code) => {
  return request(app.globalApi.group_buy_info + '/' + goods_code, { method: 'GET', data: {} })
}

module.exports = {
  get,
  post,
  put,
  remove,
  queryGoods,
  recommendGoods,
  addCart,
  getAvailableCart,
  touchCart,
  checkedCart,
  countCart,
  addAddr,
  deliveryCheck,
  delCart,
  delCartChceked,
  cartAgain,
  modifyAddr,
  getAddr,
  queryAddr,
  delAddr,
  firstAddr,
  nearAddr,
  globalNearAddr,
  vipPlans,
  vipOpen,
  getUser,
  createPay,
  pay,
  createOrder,
  createBuyVipOrder,
  createGroupOrder,
  queryOrder,
  getOrder,
  feedbackOrder,
  cancelOrder,
  getOrderCount,
  getOrderProgress,
  confirmDeliver,
  autoChooseCoupon,
  chooseCoupon,
  queryEffectiveCoupon,
  countEffectiveCoupon,
  queryCoupon,
  uploadImg,
  getSearchInfo,
  clearSearchHis,
  getRunData,
  queryCoin,
  queryExchangeItem,
  exchangeItem,
  getLowerExchangeItem,
  queryRefund,
  applyRefund,
  addQuestion,
  checkPhone,
  createRedPaper,
  getRedPaper,
  takeRedPaper,
  getLocus,
  groupBuyQuery,
  groupBuyInfo
}