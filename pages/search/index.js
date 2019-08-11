// pages/search/index.js
const app = getApp()
import api from '../../api/api'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fs: app.globalData.fs,
    focus: true,
    border: false,
    keys: [],
    word: '',
    page: {},
    goods_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getSearchInfo().then(res => {
      this.setData({ keys: res })
    })
    api.recommendGoods().then(res => {
      this.setData({ goods_list: res })
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
    this.setData({
      color: app.globalData.color
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
    return {
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
  },
  onSearch: function(e) {
    if (undefined === e.detail ||  e.detail === '' || null === e.detail) return
    wx.navigateTo({
      url: '/pages/list/index?type=search&title=搜索结果&word=' + e.detail
    })
  },
  onClearSearchHis: function() {
    api.clearSearchHis().then(res => {
      this.data.keys.his = []
      this.setData({ keys: this.data.keys })
    })
  },
  setWord: function(e) {
    let word = e.currentTarget.dataset.word
    if (undefined === word || word === '' || null === word) return
    wx.navigateTo({
      url: '/pages/list/index?type=search&title=搜索结果&word=' + word
    })
  },
  addCart: function(e) {
    api.addCart(e.currentTarget.dataset.id, 1).then(res => {
      Notify({
        text: '已加入购物车',
        duration: 1500,
        selector: '#van-notify',
        backgroundColor: app.globalData.color.success
      })
    }).catch(err => { 
      if (err === 'redirect.group.buy') {
        wx.navigateTo({
          url: '/pages/info/index?id=' + e.currentTarget.dataset.id
        })
      } else {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      }
    })
  },
  showInfo: function (e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
    })
  }
})