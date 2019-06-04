// pages/coin/index.js
const app = getApp()
import api from '../../api/api'
import util from '../../utils/util'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'

Page({

  /**
   * Page initial data
   */
  data: {
    title: '轻果币兑换',
    items: {},
    mine: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color
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
    api.getUser().then(res => {
      this.setData({ mine: res, now: util.formatTime(new Date()) })
    })
    api.queryExchangeItem().then(res => {
      for(let i = 0; i < res.total; i ++) {
        res.data[i].item_setting = JSON.parse(res.data[i].item_setting)
      }
      this.setData({ items: res })
    })
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
  doExchangeItem: function (e) {
    Dialog.confirm({
      title: '提示',
      message: '是否兑换该优惠券'
    }).then(() => {
      api.exchangeItem(e.currentTarget.dataset.id).then(res => {
        wx.showToast({
          title: '兑换成功',
          icon: 'success'
        })
        this.onShow()
      }).catch(err => {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      })
    }).catch(() => { })
  }
})