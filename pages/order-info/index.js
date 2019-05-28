// pages/order-info/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    title: "我的订单",
    fs: app.globalData.fs,
    loading: true,
    login: true,
    pay_success: false,
    selected_address: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let auto = options.auto === "1"
    if (options.quick === '1') {
      this.setData({ login: false })
      app.login(function() {
        this.setData({ login: true })
        this.loadOrder(options.order_code, auto)
      })
    }
    if (!this.data.login) return
    this.loadOrder(options.order_code, auto)
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
    if (this.data.pay_success) wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + this.data.order.order_code })
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
  callService: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  openGoodsList: function () {
    if (undefined === this.data.order || this.data.order.detail.length === 0) return false
    app.tempData.goods_list = this.data.order.detail
    wx.navigateTo({
      url: '/pages/goods-list/index'
    })
  },
  toPay: function(e) {
    this.setData({ paying: true })
    api.pay(e.currentTarget.dataset.id).then(res => {
      this.data.pay_success = true
      wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + order_code })
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
    }).catch(err => {
      if (!err.errMsg === 'requestPayment:fail cancel') {
        Dialog.alert({
          title: '轻果提醒',
          message: err
        }).then(() => { })
      }
      this.setData({ paying: false })
    })
  },
  cancelOrder: function() {
    Dialog.confirm({
      title: '提示',
      message: '您确定要放弃该订单吗'
    }).then(() => {
      api.cancelOrder(this.data.order.order_code).then(res => {
        wx.showToast({
          title: '订单已取消',
          icon: 'none'
        })
        wx.navigateBack({})
      }).catch(err => {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      })
    }).catch(() => {})
  },
  addCartAgain: function (e) {
    api.cartAgain(e.currentTarget.dataset.id).then(res => {
      wx.switchTab({ url: '/pages/cart/index' })
    })
  },
  toQuestion: function(e) {
    wx.navigateTo({
      url: '/pages/question/index?type=' + e.currentTarget.dataset.type + '&order_code=' + e.currentTarget.dataset.id
    })
  },
  loadOrder: function(order_code, auto) {
    api.getOrder(order_code).then(res => {
      if (null === res || undefined === res) wx.navigateBack({})
      res.deliver_info = JSON.parse(res.deliver_info)
      let _time = new Date(res.deliver_end_time)
      let _now = new Date()
      let _year = _now.getFullYear() + '-' + (_now.getMonth() + 1) + '-' + _now.getDate()
      let _deliver_year = _time.getFullYear() + '-' + (_time.getMonth() + 1) + '-' + _time.getDate()
      res.deliver_time_label = (_year === _deliver_year ? '今天' : _deliver_year) + ' ' + _time.getHours() + ':' + (_time.getMinutes() < 10 ? '0' + _time.getMinutes() : _time.getMinutes()) + ' 前 '
      let sum = 0
      for (let i = 0; i < res.detail.length; i++) sum += res.detail[i].amount
      this.setData({
        loading: false,
        paying: auto,
        order: res,
        color: app.globalData.color,
        sum: sum,
        selected_address: app.globalData.selected_address
      })
      if (auto && res.order_state === 0) {
        api.pay(order_code).then(res => {
          this.setData({ paying: false })
          this.data.pay_success = true
          wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + order_code })
        }).catch(err => {
          if (!err.errMsg === 'requestPayment:fail cancel') {
            Dialog.alert({
              title: '轻果提醒',
              message: err
            }).then(() => { })
          }
          this.setData({ paying: false })
        })
      }
    }).catch(err => {
      Dialog.alert({
        title: '轻果提醒',
        message: err
      }).then(() => { })
      Toast.clear()
    })
  }
})