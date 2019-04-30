// pages/my-address/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '我的地址'
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
  toAddAddress: function () {
    wx.navigateTo({
      url: '/pages/address/index?type=0&id=' + 1,
    })
  },
  toModifyAddress: function () {
    wx.navigateTo({
      url: '/pages/address/index?type=1&id=' + 1,
    })
  },
  onSelectAddress: function() {
    app.globalData.selected_address = {
      address_type: '住宅',
      phone: '18610245757',
      recive_name: '张雨卿',
      address_info: '北京 北京市 大兴区 紫宸苑 1502'
    }
    wx.navigateBack({})
  }
})