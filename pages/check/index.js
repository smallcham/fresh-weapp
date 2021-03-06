// pages/check/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import api from '../../api/api'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '填写订单',
    loading: true,
    fs: app.globalData.fs,
    selected_address: app.globalData.selected_address,
    showTimePicker: false,
    selectedTime: '',
    chooseCoupon: false,
    house: app.globalData.house,
    goods_list: [], 
    label: '今天',
    total: 0.0, 
    original: 0.0, 
    discount: 0.0, 
    is_vip: false,
    selectedTimeIndex: 0,
    timeColumns: [],
    goods_code: '',
    group_id: '',
    check_type: 'along'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      house: app.globalData.house,      
      selected_address: false,
      check_type: undefined === options.check_type ? 'along' : options.check_type,
      goods_code: undefined === options.goods_code ? '' : options.goods_code,
      group_id: undefined === options.group_id ? '' : options.group_id
    })
    app.globalData.use_coupon = app.globalData.not_use_coupon = false
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    if (this.data.selected_address && JSON.stringify(this.data.selected_address) !== JSON.stringify(app.globalData.selected_address)) {
      this.getHouse(app.globalData.selected_address.city_code, app.globalData.selected_address.lat, app.globalData.selected_address.lng)
    } else {
      if (this.data.check_type === 'group') {
        this.loadGroupGoods()
      } else {
        this.getAvailableCart()
      }
    }
    this.setData({
      selected_address: app.globalData.selected_address
    })
    api.getUser().then(mine => {
      api.getLowerExchangeItem().then(item => {
        if (null !== item && undefined !== item && item.item_price <= mine.coin) {
          this.setData({ mine: mine, lowerItem: item })
        } else {
          this.setData({ mine: mine, lowerItem: false })
        }
      })
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },
  toExchange: function() {
    wx.navigateTo({
      url: '/pages/coin/index'
    })
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
    return {
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
  },
  toCheck: function(e) {
    if (app.globalData.selected_address === undefined || app.globalData.selected_address === false || app.globalData.selected_address === null) {
      Dialog.alert({
        title: '轻果提醒',
        message: '请选择收货地址'
      }).then(() => {
        // on close
      });
      return false
    }
    Toast.loading({
      mask: true
    });

    if (this.data.check_type === 'group') {
      //拼团订单
      api.createGroupOrder(this.data.goods_code, this.data.group_id).then(res => {
        if (null === res || undefined === res) {
          Dialog.alert({
            title: '轻果提醒',
            message: '创建订单失败，请稍候重试或联系客服'
          }).then(() => { })
          Toast.clear()
          return false
        }
        wx.redirectTo({
          url: '/pages/order-info/index?auto=1&order_code=' + res
        })
      }).catch(err => {
        Dialog.alert({
          title: '轻果提醒',
          message: err
        }).then(() => { })
        Toast.clear()
        return false
      })
    } else {
      //普通购买订单
      api.createOrder(this.data.label === '今天' ? 'TODAY' : 'TOMORROW', this.data.timeColumns[this.data.selectedTimeIndex], this.data.chooseCoupon ? [this.data.chooseCoupon.id] : []).then(res => {
        if (null === res || undefined === res) {
          Dialog.alert({
            title: '轻果提醒',
            message: '创建订单失败，请稍候重试或联系客服'
          }).then(() => { })
          Toast.clear()
          return false
        }
        wx.redirectTo({
          url: '/pages/order-info/index?auto=1&order_code=' + res
        })
      }).catch(err => {
        Dialog.alert({
          title: '轻果提醒',
          message: err
        }).then(() => { })
        Toast.clear()
        return false
      })
    }
  },
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/my-address/index'
    })
  },
  openGoodsList: function() {
    if (undefined === this.data.goods_list || this.data.goods_list.length === 0) return false
    app.tempData.goods_list = this.data.goods_list
    wx.navigateTo({
      url: '/pages/goods-list/index'
    })
  },
  openTimePicker: function() {
    this.setData({ showTimePicker: true })
  },
  onPickTimeConfirm(event) {
    const { picker, value, index } = event.detail;
    this.setData({ showTimePicker: false, selectedTimeIndex: index })
  },
  getHouse: function (city, lat, lng) {
    api.get(app.globalApi.get_house, { data: { city: city, to: (lat + ',' + lng) } }).then(res => {
      if (res.id === app.globalData.house.id) return true
      this.setData({ house: res })
      app.globalData.house = res
      wx.showToast({
        title: '由于您切换收货地址商品可能有变更,请注意检查订单商品',
        duration: 2500,
        icon: 'none'
      })
      if (this.data.check_type === 'group') {
        this.loadGroupGoods()
      } else {
        this.getAvailableCart()
      }
    }).catch(err => { })
  },
  onPickTimeCancel() {
    this.setData({ showTimePicker: false })
  },
  getAvailableCart: function() {
    api.getAvailableCart().then(res => {
      if (null === res || undefined === res || res.carts.length < 1) {
        Dialog.alert({
          title: '轻果提醒',
          message: '当前地址对应的购物车商品无效或为空，无法结算，请更换地址或修改购物车商品'
        }).then(() => {
          wx.navigateBack({})
        });
        this.setData({ loading: false })
        return false
      }
      this.setData({ goods_list: res.carts, sum: res.sum, total: res.total, original: res.original, discount: res.discount, is_vip: res.is_vip })
      Toast.clear()
      //用户选择不使用优惠券
      if (app.globalData.not_use_coupon === true) {
        let delivery_fee = this.data.total >= Number(res.free_delivery_limit) ? 0 : Number(res.delivery_fee)
        let real_pay = (Number(this.data.total) + Number(delivery_fee)).toFixed(1)
        this.setData({ chooseCoupon: false, real_pay: real_pay, delivery_fee: delivery_fee, loading: false })
        return
      }
      //用户手动选择优惠券
      if (app.globalData.use_coupon !== false) {
        let total = Number(this.data.total - app.globalData.use_coupon.discount_amount).toFixed(1)
        let delivery_fee = total >= Number(res.free_delivery_limit) ? 0 : Number(res.delivery_fee)
        let real_pay = (Number(total) + Number(delivery_fee)).toFixed(1)
        this.setData({ chooseCoupon: app.globalData.use_coupon, total: total, real_pay: real_pay, delivery_fee: delivery_fee, loading: false })
        app.globalData.use_coupon = false
      } else {
        //自动选择最优优惠方案
        api.autoChooseCoupon().then(coupon => {
          let discount = 0
          if (null === coupon || undefined === coupon) {
            coupon = false
          } else {
            discount = coupon.discount_amount
          }
          let total = Number(this.data.total - discount).toFixed(1)
          let delivery_fee = total >= Number(res.free_delivery_limit) ? 0 : Number(res.delivery_fee).toFixed(1)
          let real_pay = (Number(total) + Number(delivery_fee)).toFixed(1)
          this.setData({ chooseCoupon: coupon, total: total, real_pay: real_pay, delivery_fee: delivery_fee, loading: false })
        })
      }
    })
    this.deliverTime()
  },
  deliverTime: function() {
    let house = app.globalData.house
    let date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    let start_time = new Date(house.start_time.replace(/-/g, '/'))
    let end_time = new Date(house.end_time.replace(/-/g, '/'))
    let now_min = hour * 60 + minute
    let start_min = start_time.getHours() * 60 + start_time.getMinutes()
    let end_min = end_time.getHours() * 60 + end_time.getMinutes()

    if (now_min >= start_min && now_min < end_min ) {
      let _mod = now_min % 60
      start_min = _mod === 0 ? now_min : now_min + (60 - _mod)
    }
    
    if (now_min >= end_min || start_min >= end_min) {
      this.data.label = '明天'
      start_min = start_time.getHours() * 60 + start_time.getMinutes()
    }

    let times = []
    for (let i = start_min; i < end_min; i += 60) {
      let _hour = i / 60
      let _min = i % 60
      _min = _min < 10 ? '0' + _min : _min
      let _time = _hour + ':' + _min + '-' + (_hour + 1) + ':' + _min
      times.push(_time)
    }
    this.setData({ label: this.data.label, timeColumns: times })
  },
  loadGroupGoods: function() {
    api.groupBuyInfo(this.data.goods_code).then(res => {
      if (null === res || undefined === res || null === res.info || undefined === res.info) {
        Dialog.alert({
          title: '轻果提醒',
          message: '该收货地址不参与当前商品的拼团活动,请选择其它商品'
        }).then(() => {
          app.globalData.selected_address = false
          this.setData({ selected_address: false })
          wx.navigateBack({})
        })
        return false
      }
      if (res.info.group_buy_state === 1) {
        Dialog.alert({
          title: '轻果提醒',
          message: '该拼团商品活动已暂停'
        }).then(() => {
          wx.navigateBack({})
        })
        return false
      }
      // if (res.info.buy_count >= res.info.buy_limit) {
      //   Dialog.alert({
      //     title: '轻果提醒',
      //     message: '该拼团商品已被抢光，快去抢购其他商品吧!'
      //   }).then(() => {
      //     wx.navigateBack({})
      //   })
      //   return false
      // }
      let delivery_fee = res.info.group_price >= Number(res.free_delivery_limit) ? 0 : Number(res.delivery_fee).toFixed(1)
      let total = Number(res.info.group_price).toFixed(1)
      let discount = (Number(res.info.original) + Number(res.info.group_price)).toFixed(1)
      let real_pay = (Number(total) + Number(delivery_fee)).toFixed(1)
      res.info.amount = 1
      this.setData({ goods_list: [res.info], sum: 1, total: total, original: res.info.original, discount: discount, real_pay: real_pay, delivery_fee: delivery_fee, loading: false })
    })
  }
})