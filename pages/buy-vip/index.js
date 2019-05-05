import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()
// pages/buy-vip/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '开通会员',
    fs: app.globalData.fs,
    checked: 1,
    loading: false,
    now: new Date(),
    plan: {},
    mine: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      userInfo: app.globalData.userInfo,
      plans: []
    })
    api.vipPlans().then(res => {
      this.setData({
        plans: res,
        plan: res[this.data.checked]
      })
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
    this.setData({ now: util.formatTime(new Date()) })
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
  onChangePlan: function(e) {
    this.setData({ checked: e.currentTarget.dataset.id, plan: this.data.plans[e.currentTarget.dataset.id] })
  },
  openVip: function() {
    this.setData({ loading: true })
    api.vipOpen(this.data.checked).then(res => {
      api.getUser().then(res => {
        app.globalData.userInfo.mine = res
        this.setData({ loading: false })
        Dialog.alert({
          title: '轻果提醒',
          message: '会员购买成功'
        }).then(() => {
            wx.navigateBack({})
        })
      })
    }).catch(err => {
      this.setData({ loading: false })
      Dialog.alert({
        title: '轻果提醒',
        message: err
      }).then(() => {
        // on close
      })
    })
  }
})