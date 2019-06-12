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
    this.loadOrder() 
    let that = this
    let id = setInterval(function() {
      that.loadOrder()
      if (that.data.order && that.data.order.order_state !== 0) clearInterval(id)
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
      let end_time = new Date(res.deliver_end_time)
      let now = new Date()
      let end_min = end_time.getHours() * 60 + end_time.getMinutes()
      let now_min = now.getHours() * 60 + now.getMinutes()
      this.setData({ order: res, deliver_time: end_min <= now_min ? ('今天' + res.deliver_end_time.split(' ')[1]) : res.deliver_end_time })
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