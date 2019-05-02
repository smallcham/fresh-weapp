// pages/check/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '填写订单',
    selected_address: app.globalData.selected_address
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
    wx.navigateTo({
      url: '/pages/order-info/index'
    })
  },
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/my-address/index'
    })
  }
})