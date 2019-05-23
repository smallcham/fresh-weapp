import api from '../../api/api'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    fs: app.globalData.fs,
    title: '选择售后类型'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    api.getOrder(options.order_code).then(res => {
      this.setData({ color: app.globalData.color, order: res, goods_code: options.goods_code })
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

  }
})