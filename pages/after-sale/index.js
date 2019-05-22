import api from '../../api/api'
const app = getApp()
// pages/after-sale/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    title: '售后服务',
    fs: app.globalData.fs,
    active: 0,
    order: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.data.order_code = options.order_code
    api.getOrder(this.data.order_code).then(res => {
      this.setData({ color: app.globalData.color, order: res })
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
  apply: function(e) {
    wx.navigateTo({
      url: '/pages/after-sale-type/index?order_code=' + this.data.order_code + '&goods_code=' + e.currentTarget.dataset.id
    })
  }
})