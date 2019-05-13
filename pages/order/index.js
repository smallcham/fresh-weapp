// pages/order/index.js
const app = getApp()
import api from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "我的订单",
    fs: app.globalData.fs,
    active: "0",
    last: false,
    orderType: [
      { text: '全部', id: 0 },
      { text: '待付款', id: 1 },
      { text: '待发货', id: 2 },
      { text: '配送中', id: 3 },
      { text: '已完成', id: 4 }
    ],
    content: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      active: app.is_null(options.active) ? 0 : options.active
    })
    this.data.state = this.options.state
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
    this.setData({
      active: this.data.active
    })
    wx.setNavigationBarTitle({
      title: this.data.title,
    }) 
    this.orderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onChange: function (e) {
    this.data.state = e.detail.index === 0 ? undefined : e.detail.index - 1
    this.orderList()
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
    this.orderListNext()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  orderList: function () {
    api.queryOrder(1, this.data.state).then(res => {
      this.setData({ order_list: res, last: res.total <= res.per_page })
    })
  },
  orderListNext: function () {
    if (this.data.order_list.total === 0 || this.data.order_list.current_page === this.data.order_list.last_page) {
      this.setData({ last: true })
      return false
    }
    api.queryOrder(this.data.order_list.current_page + 1, this.data.state).then(res => {
      this.data.order_list.data.concat(res.data)
      console.log(this.data.order_list.data)
      this.setData({ order_list: this.data.order_list, last: res.current_page === res.last_page })
    })
  },
  toPay: function(e) {
    wx.navigateTo({
      url: '/pages/order-info/index?order_code=' + e.currentTarget.dataset.id + "&auto=1"
    })
  },
  showOrder: function(e) {
    wx.navigateTo({
      url: '/pages/order-info/index?order_code=' + e.currentTarget.dataset.id
    })
  }
})