// custom-tab-bar/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    active: 0,
    color: app.globalData.color,
    cartCount: 0,
    animationData: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
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
  action: function() {

  },
  onChange: function (event) {
    if (event.detail === 0) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    else if (event.detail === 1) {
      wx.switchTab({
        url: '/pages/cata/index',
      })
    }
    else if (event.detail === 2) {
      wx.switchTab({
        url: '/pages/vip/index',
      })
    }
    else if (event.detail === 3) {
      wx.switchTab({
        url: '/pages/cart/index',
      })
    }
    else if (event.detail === 4) {
      wx.switchTab({
        url: '/pages/mine/index',
      })
    } else {

    }
    this.setData({
      active: event.detail
    })
  },
})