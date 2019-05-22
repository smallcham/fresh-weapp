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
    pay_success: false,
    selected_address: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let auto = options.auto === "1"
    let order_code = options.order_code
    api.getOrder(order_code).then(res => {
      if (null === res || undefined === res) wx.navigateBack({})
      res.deliver_info = JSON.parse(res.deliver_info)
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
        this.setData({ paying: false })
        api.pay(order_code).then(res => {
          this.data.pay_success = true
          wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + order_code })
        }).catch(err => {
          if (!err.errMsg === 'requestPayment:fail cancel') {
            Dialog.alert({
              title: '轻果提醒',
              message: err
            }).then(() => {})
          }
        })
      }
    }).catch(err => {
      Dialog.alert({
        title: '轻果提醒',
        message: err
      }).then(() => { })
      Toast.clear()
    })
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
    api.pay(e.currentTarget.dataset.id).then(res => {
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
    })
  },
  loadOrder: function() {
    api.getOrder(this.data.order.order_code).then(res => {
      if (null === res || undefined === res) wx.navigateBack({})
      res.deliver_info = JSON.parse(res.deliver_info)
      let sum = 0
      for (let i = 0; i < res.detail.length; i++) sum += res.detail[i].amount
      this.setData({ loading: false, order: res, sum: sum })
    }).catch(err => {
      Dialog.alert({
        title: '轻果提醒',
        message: err
      }).then(() => { })
      Toast.clear()
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
        this.loadOrder()
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
  }
})