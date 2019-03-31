// pages/location/index.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    title: "选择地址",
    location: {
      address: "位置获取中"
    },
    border: false
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
    app.getLocation(this, 1);
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
  refresh: function() {
    app.getLocation(this, 1);
  },
  onChoose: function(e) {
    this.data.location = this.data.location.pois[e.currentTarget.dataset.index]
    app.globalData.location = this.data.location
    wx.navigateBack({})
  }
})