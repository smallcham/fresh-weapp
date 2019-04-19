// pages/mine/index.js
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      color: app.globalData.color
    })
    this.getTabBar().setData({
      selected: 4
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
    this.getTabBar().setData({
      selected: 4
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

  }, showOrder: function(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    api.post(app.globalApi.reg, { data: e.detail.userInfo }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
  }
})