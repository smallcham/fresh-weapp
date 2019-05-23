// pages/refund/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import api from '../../api/api'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '申请退款',
    fs: app.globalData.fs,
    real_refund: 0,
    refund_amount: 1,
    reason: '',
    show: true,
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getOrder(options.order_code).then(res => {
      this.setData({ color: app.globalData.color, order: res, goods_code: options.goods_code })
      this.calcRefund()
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
  onChangeNum: function(e) {
    this.setData({ refund_amount: e.detail })
    this.calcRefund()
  },
  onChangeText: function(e) {
    this.setData({ reason: e.detail })
  },
  uploadImg: function (e) {
    if (this.data.imgs.length >= 6) {
      wx.showToast({
        title: '最多上传6张哦',
        icon: 'none'
      })
      return
    }
    api.uploadImg().then(res => {
      this.data.imgs.push(res)
      this.setData({ imgs: this.data.imgs })
    })
  },
  delImg: function (e) {
    this.data.imgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({ imgs: this.data.imgs })
  },
  calcRefund: function() {
    let total = 0
    let goods = false
    for(let i = 0; i < this.data.order.detail.length; i++) {
      total += Number(this.data.order.detail[i].total)
      if (this.data.order.detail[i].goods_code === this.data.goods_code) goods = this.data.order.detail[i]
    }
    if (!goods) {
      wx.showToast({
        title: '该商品无法退费',
        icon: 'none'
      })
    }
    let rate = Number(goods.total) / total.toFixed(1)
    let discount = rate * Number(this.data.order.coupon_discount_total).toFixed(1)
    let refund_total = Number(((goods.total - discount) / goods.amount) * this.data.refund_amount).toFixed(1)
    if (refund_total > Number(this.data.order.actual_total)) refund_total = this.data.order.actual_total
    this.setData({ real_refund: refund_total <= 0 ? 0 : refund_total })
  },
  submitRefund: function() {
    if (this.data.refund_total <= 0) {
      wx.showToast({
        title: '该商品可推出金额为0，无法退费',
        icon: 'none'
      })
      return
    }
    api.applyRefund(this.data.order.order_code, this.data.goods_code, this.data.refund_amount, this.data.reason, this.data.imgs).then(res => {
      this.setData({ show: false })
      Dialog.alert({
        title: '提交成功',
        message: '退费申请已提交，请耐心等待审核，退费成功后将原路返回您的账户'
      }).then(() => {
        wx.navigateBack({})
      })
    }).catch(err => {
      this.setData({ show: false })
      Dialog.alert({
        title: '提交失败',
        message: err
      }).then(() => {
        this.setData({ show: true })
      })
    })
  }
})