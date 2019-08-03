// pages/order-progress/index.js
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "订单进度",
    progress_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (undefined !== options.sub_order_code && null !== options.sub_order_code) {
      api.getLocus(options.sub_order_code).then(res => {
        let steps = []
        res = res.Traces
        for (let i = res.length - 1; i >= 0; i--) {
          steps.push({ text: res[i].AcceptStation, desc: res[i].AcceptTime })
        }
        this.setData({ color: app.globalData.color, steps: steps })
      }).catch(err => {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      })
    } else {
      api.getOrderProgress(options.order_code).then(res => {
        let steps = []
        for (let i = 0; i < res.length; i++) {
          steps.push({ text: res[i].content, desc: res[i].create_time })
        }
        this.setData({ color: app.globalData.color, steps: steps })
      })
    }
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

  }
})