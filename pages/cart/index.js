import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()

// pages/cart/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    location: app.globalData.location
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
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
    this.getTabBar().setData({
      active: 3
    })
    this.setData({
      location: app.globalData.location
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
  onChangeNum: function(e) {
    if (parseInt(e.detail) <= 0) {
      Dialog.confirm({
        title: '提示',
        message: '您确定要删除该商品吗'
      }).then(() => {
        // on confirm
      }).catch(() => {

      });
    }
  },
  openLocation: function () {
    wx.navigateTo({
      url: '/pages/location/index',
    })
  }
})