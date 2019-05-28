import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '问题咨询',
    fs: app.globalData.fs,
    show: true,
    reason: '',
    columns: ['订单咨询', '支付问题', '配送问题', '少发发错',  '小程序问题', '意见反馈', '其他问题'],
    question_type: '订单咨询',
    showTypeSheet: false,
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      color: app.globalData.color,
      question_type: options.type !== undefined ? options.type : this.data.columns[4],
      reason: undefined !== options.order_code ? '咨询订单号: [' + options.order_code + ']\n问题描述: \n\n' : ''
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
      title: this.data.title
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
  onChangeText: function (e) {
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
  showType: function() {
    this.setData({ showTypeSheet: true })
  },
  hideType: function() {
    this.setData({ showTypeSheet: false })
  },
  selectedType: function(e) {
    const { picker, value, index } = e.detail;
    this.setData({
      question_type: value,
      showTypeSheet: false
    })
  },
  submitQuestion: function() {
    if (null === this.data.question_type || undefined === this.data.question_type || '' === this.data.question_type) {
      wx.showToast({ title: '请选择问题分类', icon: 'none' })
      return
    }
    if (null === this.data.reason || undefined === this.data.reason || '' === this.data.reason) {
      wx.showToast({ title: '请描述问题原因', icon: 'none' })
      return
    }
    api.addQuestion(this.data.question_type, this.data.reason, this.data.imgs).then(res => {
      this.setData({ show: false })
      Dialog.alert({
        title: '提交成功',
        message: '您的问题已提交成功，我们会尽快处理，请耐心等待'
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