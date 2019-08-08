// pages/team/index.js
import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '超值拼团',
    fs: app.globalData.fs,
    is_vip: false,
    goods_list: [],
    goods_name: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      color: app.globalData.color,
    })
    this.getTabBar().setData({
      selected: 2
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 2
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.onQuery()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  showInfo: function(e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onQuery: function() {
    api.groupBuyQuery(this.data.goods_name).then(res => {
      this.setData({ goods_list: res })
    })
  }
})