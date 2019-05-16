// pages/feedback/index.js
const app = getApp()
import api from '../../api/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '评价得积分',
    fs: app.globalData.fs,
    order: false,
    readonly: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getOrder(options.order_code).then(res => {
      for(let i = 0; i < res.detail.length; i ++) {
        res.detail[i].star = res.detail[i].star === 0 ? 5 : res.detail[i].star
        res.detail[i].feedback_imgs = res.detail[i].feedback_imgs === '[]' ? [] : JSON.parse(res.detail[i].feedback_imgs)
      }
      this.setData({ color: app.globalData.color, order: res, readonly: res.deliver_star !== 0 })
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    }) 
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
  uploadImg: function(e) {
    let idx = e.currentTarget.dataset.index
    api.uploadImg().then(res => {
      let imgs = this.data.order.detail[idx].feedback_imgs
      if (undefined === imgs || '[]' === imgs) {
        imgs = [res]
      } else {
        imgs.push(res)
      }
      this.data.order.detail[idx].feedback_imgs = imgs
      this.setData({ order:  this.data.order })
    })
  },
  submitFeedback: function() {
    api.feedbackOrder(this.data.order.order_code, this.data.order).then(res => {
      wx.navigateBack({})
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
  },
  delImg: function(e)  {
    this.data.order.detail[e.currentTarget.dataset.pindex].feedback_imgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({ order: this.data.order })
  },
  onChangeDeliverStar: function (e) {
    this.data.order.deliver_star = e.detail
    this.setData({ order: this.data.order })
  },
  onChangeQualityStar: function (e) {
    this.data.order.quality_star = e.detail
    this.setData({ order: this.data.order })
  },
  onChangeGoodsStar: function (e) {
    this.data.order.detail[e.currentTarget.dataset.index].star = e.detail
  },
  onChangeText: function(e) {
    this.data.order.detail[e.currentTarget.dataset.index].feedback_text = e.detail
  }
})