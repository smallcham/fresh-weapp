// pages/pay-success/index.js
import api from '../../api/api'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "支付结果",
    order_code: '',
    order: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_code = options.order_code
    this.setData({
      color: app.globalData.color,
      order_code: options.order_code
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    }) 
    let id = setInterval(function() {
      this.loadOrder()
      if (this.data.order && this.data.order.order_state !== 0) clearInterval(id)
    }, 2000)
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
  loadOrder: function() {
    api.getOrder(this.data.order_code).then(res => {
      this.setData({ order: res })
    })
  },
  toOrderInfo: function(e) {
    wx.navigateTo({
      url: '/pages/order-info/index?order_code=' + e.currentTarget.dataset.id
    })
  },
  toHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})