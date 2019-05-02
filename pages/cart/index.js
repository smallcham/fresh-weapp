import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import api from '../../api/api';
const app = getApp()
// pages/cart/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    selected_location: false,
    location: app.globalData.location,
    fs: app.globalData.fs,
    carts: []
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
      selected: 3
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
    this.cartList()
    this.setData({
      location: app.globalData.location,
      selected_location: app.globalData.selected_location
    })
    this.getTabBar().setData({
      selected: 3
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
      url: '/pages/location/index'
    })
  },
  toCheck: function() {
    wx.navigateTo({
      url: '/pages/check/index'
    })
  },
  cartList: function() {
    api.get(app.globalApi.cart_list, {}).then(res => { 
      this.setData({ carts: res })
     }).catch(err => {})
  }
})