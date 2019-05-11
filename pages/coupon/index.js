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
    now: new Date()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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

  
  },
  openInfo: function(e) {
    this.setData({ activeInfo: e.detail })
  },
  getCanUseCoupons: function() {
    api.queryEffectiveCoupon().then(res => {
      if (undefined !== res) this.setData({ coupons: res, loading: false })
      else {
        this.setData({ loading: false })
      }
    })
  }
})