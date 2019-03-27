import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
// pages/info/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    cartCount: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color
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

  onAddCart: function(e) {
    Notify({
      text: '¥ 29.2 元，还差49.2免配送费',
      duration: 3000,
      selector: '#custom-notify',
      backgroundColor: this.data.color.warning
    });
  },
  onToCart: function(e) {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  }
})