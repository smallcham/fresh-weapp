// pages/mine/index.js
import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      now: new Date(),
      mine: {},
      expireDay: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      color: app.globalData.color,
    })
    this.getTabBar().setData({
      selected: 4
    })
    if (null !== app.globalData.userInfo) {
      api.getUser().then(res => {
        app.globalData.userInfo.mine = res
        this.setData({ mine: res, expireDay: util.diffDay(res.vip_expire_time) })
      })
    }
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
    if (null !== app.globalData.userInfo) {
      let _mine = undefined !== app.globalData.userInfo.mine ? app.globalData.userInfo.mine : this.data.mine
      this.setData({
        mine: undefined !== app.globalData.userInfo.mine ? app.globalData.userInfo.mine : {},
        now: util.formatTime(new Date()),
        expireDay: undefined !== _mine.vip_expire_time ? util.diffDay(_mine.vip_expire_time) : 0
      })
    }
    api.countCart().then(res => {
      this.getTabBar().setCartCount((null === res || undefined === res) ? 0 : Number(res))
    })
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
  openMyAddress: function(e) {
    wx.navigateTo({
      url: '/pages/my-address/index',
    })
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo === undefined) return false
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    api.getUser().then(res => {
      app.globalData.userInfo.mine = res
      this.setData({ now: util.formatTime(new Date()), mine: res, expireDay: util.diffDay(res.vip_expire_time) })
    })
    api.post(app.globalApi.reg, { data: e.detail }).then(res => {}).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
  },
  toVipBuy: function() {
    wx.navigateTo({
      url: '/pages/buy-vip/index'
    })
  }
})