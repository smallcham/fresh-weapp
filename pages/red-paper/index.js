import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '红包领取',
    userInfo: app.globalData.userInfo
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      paper_code: options.paper_code,
      userInfo: app.globalData.userInfo
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
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    if (null === this.data.userInfo) {
      let that = this
      app.login(function () { that.getPaper() })
    } else {
      this.getPaper()
    }
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
  take: function() {
    api.takeRedPaper(this.data.paper_code).then(res => {
      this.onShow()
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })    
    })
  },
  toHome: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getPaper: function() {
    api.getRedPaper(this.data.paper_code).then(res => {
      this.setData({ redPaper: res, now: util.formatTime(new Date()) })
    }).catch(err => {
      wx.showToast({
        title: '该红包已过期或不存在',
        icon: 'none'
      })
    })
  }
})