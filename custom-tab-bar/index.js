// custom-tab-bar/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    active: 0
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
  onChange: function (event) {
    console.log(event.detail);
    if (event.detail === 0) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    else if (event.detail === 3) {
      wx.switchTab({
        url: '/pages/cart/index',
      })
    }
  },
})