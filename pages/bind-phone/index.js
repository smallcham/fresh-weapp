// pages/bind-phone/index.js
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '手机验证'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color
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
  toPage: function (e) {
    wx.navigateTo({
      url: '/pages/web/index?src=' + app.globalApi.root + e.currentTarget.dataset.src
    })
  },
  getPhoneNumber(e) {
    if (e.detail.encryptedData === undefined) {
      wx.showToast({
        title: '未授权无法绑定',
        icon: 'none'
      })
      return false
    }
    api.checkPhone(e.detail.iv, e.detail.encryptedData).then(res => {
      app.globalData.mine.phone = res
      wx.navigateBack({})
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
  }
})