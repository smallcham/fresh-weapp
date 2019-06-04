// pages/mine/index.js
import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      fs: app.globalData.fs,
      now: new Date(),
      mine: {},
      step: 0,
      expireDay: 0,
      coin: 0,
      couponCount: 0,
      orderCount: { unpay: 0, un_deliver: 0, delivering: 0 }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // this.getRunData()
    this.setData({
      userInfo: app.globalData.userInfo,
      color: app.globalData.color,
    })
    this.getTabBar().setData({
      selected: 4
    })
    this.getLink()
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
    api.getUser().then(res => {
      if (null === app.globalData.userInfo) return
      app.globalData.userInfo.mine = res
      this.setData({ now: util.formatTime(new Date()), mine: res, coin: res.coin, expireDay: util.diffDay(res.vip_expire_time) })
    })
    api.countCart().then(res => {
      this.getTabBar().setCartCount((null === res || undefined === res) ? 0 : Number(res))
    })
    api.getOrderCount().then(res => {
      this.setData({ orderCount: res })
    })
    api.countEffectiveCoupon().then(res => {
      this.setData({ couponCount: res })
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
    return {
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
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
  },
  toCoupon: function() {
    wx.navigateTo({
      url: '/pages/coupon/index?read_only=1'
    })
  },
  toCoin: function() {
    wx.navigateTo({
      url: '/pages/coin/index'
    })
  },
  getLink: function () {
    api.get(app.globalApi.get_link, { data: { link_type: 2 } }).then(res => {
      if (res === undefined) return
      this.setData({ banner: res })
    }).catch(err => {})
  },
  clickLink: function(e) {
    let banner = this.data.banner[e.currentTarget.dataset.idx]
    app.clickLink(banner.url, banner.url_type)
  },
  toSetting: function() {
    wx.navigateTo({
      url: '/pages/setting/index'
    })
  },
  getRunData: function() {
    let that = this
    wx.getWeRunData({
      success: function(e) {
        api.getRunData(e.iv, e.encryptedData).then(res => {
          let step = undefined === res.stepInfoList || res.stepInfoList.length <= 0 ? 0 : res.stepInfoList[res.stepInfoList.length - 1].step
          that.setData({ step: step })
        })
      }
    })
  },
  toQuestion: function() {
    wx.navigateTo({
      url: '/pages/question/index'
    })
  }
})