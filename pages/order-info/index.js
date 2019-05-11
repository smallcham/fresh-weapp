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
    loading: true,
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
      this.setData({
        loading: false,
        order: res,
        color: app.globalData.color,
        selected_address: app.globalData.selected_address
      })
      if (auto && res.order_state === 0) {
        Toast.loading({
          mask: true
        });
        api.pay(order_code).then(res => {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })
          Toast.clear()
        }).catch(err => {
          if (!err.errMsg === 'requestPayment:fail cancel') {
            Dialog.alert({
              title: '轻果提醒',
              message: err
            }).then(() => {})
          }
          Toast.clear()
        })
      }
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

  },
  callService: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone
    })
  },
  toPay: function() {
    Toast.loading({
      mask: true
    });
    api.pay(order_code).then(res => {
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
      Toast.clear()
    }).catch(err => {
      Dialog.alert({
        title: '轻果提醒',
        message: err
      }).then(() => { Toast.clear() })
    })
  }
})