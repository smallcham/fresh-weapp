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
      if (that.data.order && that.data.order.order_state !== 0) { 
        clearInterval(id)
        if (that.data.order.is_group === 1) {
          wx.navigateTo({
            url: '/pages/order-info/index?order_code=' + that.data.order_code
          })
        }
      }
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
    return {
      title: '吃吃吃, 快来这里买, 最快1小时达!',
      path: '/pages/red-paper/index?paper_code=' + this.data.paper.paper_code,
      imageUrl: app.globalData.fs + 'red_paper_new1.png'//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
  loadOrder: function() {
    api.getOrder(this.data.order_code).then(res => {
      let end_time = new Date(res.deliver_end_time)
      let now = new Date()
      let _year = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      let _deliver_year = end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate()
      this.setData({ order: res, deliver_time: _deliver_year === _year ? ('今天' + res.deliver_end_time.split(' ')[1]) : res.deliver_end_time })
      if (res.order_state !== 0) {
        api.createRedPaper(this.data.order_code).then(res => {
          this.setData({ paper: res })
          if (null === this.data.paper || null === this.data.paper.amount || this.data.paper.amount <= 0) {
            wx.hideShareMenu({})
            return false
          }
        })
      }
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
  },
  toShare: function() {
    wx.redirectTo({
      url: '/pages/red-paper/index?paper_code=' + this.data.paper.paper_code 
    })
  }
})