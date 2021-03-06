// pages/my-address/index.js
import api from '../../api/api'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '我的地址',
    loading: true,
    address_list: []
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
    api.queryAddr().then(res => {
      this.setData({ address_list: res, loading: false })
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
    return {
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
  },
  toAddAddress: function () {
    wx.navigateTo({
      url: '/pages/address/index?type=0',
    })
  },
  toModifyAddress: function (e) {
    wx.navigateTo({
      url: '/pages/address/index?type=1&id=' + e.currentTarget.dataset.id,
    })
  },
  onSelectAddress: function(e) {
    api.getAddr(e.currentTarget.dataset.id).then(res => {
      app.globalData.selected_address = res
      wx.navigateBack({})
    })
  }
})