// pages/coin-info/index.js
const app = getApp()
import api from '../../api/api'

Page({

  /**
   * Page initial data
   */
  data: {
    title: '轻果币明细',
    coins: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    api.queryCoin().then(res => {
      this.setData({
        color: app.globalData.color,
        coins: res
      })
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
      title: this.data.title
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