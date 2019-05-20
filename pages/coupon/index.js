// pages/coupon/index.js
const app = getApp()
import api from '../../api/api'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '优惠券',
    loading: true,
    activeInfo: [],
    coupons: [],
    read_only: false,
    not_use_coupon: false,
    disable: false,
    now: new Date()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      read_only: options.read_only === '1',
      color: app.globalData.color,
      now: util.formatTime(new Date())
    })
    this.getCanUseCoupons()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: this.data.title,
    }) 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
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
  openInfo: function(e) {
    this.setData({ activeInfo: e.detail })
  },
  getCanUseCoupons: function() {
    api.queryEffectiveCoupon().then(res => {
      if (undefined !== res) {
        app.globalData.not_use_coupon = false
        this.setData({ coupons: res, loading: false })
      }
      else {
        app.globalData.not_use_coupon = true
        this.setData({ loading: false, not_use_coupon: true, disable: true })
      }
    })
  },
  onChangeUseCoupon: function(e) {
    app.globalData.not_use_coupon = !this.data.not_use_coupon
    if (!this.data.not_use_coupon === false) app.globalData.use_coupon = false
    this.setData({ not_use_coupon: !this.data.not_use_coupon })
  },
  chooseCoupon: function(e) {
    app.globalData.use_coupon = this.data.coupons[e.currentTarget.dataset.idx]
    wx.navigateBack({})
  }
})