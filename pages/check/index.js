// pages/check/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '填写订单',
    selected_address: app.globalData.selected_address,
    showTimePicker: false,
    selectedTime: '',
    house: app.globalData.house,
    timeColumns: ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00']
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      house: app.globalData.house,
      selectedTime: this.data.timeColumns[0]
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
    this.setData({
      selected_address: app.globalData.selected_address
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
  toCheck: function() {
    if (app.globalData.selected_address === undefined || app.globalData.selected_address === false || app.globalData.selected_address === null) {
      Dialog.alert({
        title: '轻果提醒',
        message: '请选择收货地址'
      }).then(() => {
        // on close
      });
      return false
    }
    wx.navigateTo({
      url: '/pages/order-info/index'
    })
  },
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/my-address/index'
    })
  },
  openTimePicker: function() {
    this.setData({ showTimePicker: true })
  },
  onPickTimeConfirm(event) {
    const { picker, value, index } = event.detail;
    this.setData({ showTimePicker: false, selectedTime: value })
  },
  onPickTimeCancel() {
    this.setData({ showTimePicker: false })
  }
})