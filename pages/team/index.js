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
    active: 0,
    goods_list: [],
    last: false,
    goods_name: '',
    steps: [
      {
        text: '① 开团',
        desc: ''
      },
      {
        text: '②. 邀好友',
        desc: ''
      },
      {
        text: '③ 成团',
        desc: ''
      },
      {
        text: '④ 发货',
        desc: ''
      }
    ]
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
    this.setData({ active: 0 })
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
    this.onQuery()
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  onChange: function(e) {
    if (e.detail.index === 1) {
      wx.navigateTo({
        url: '/pages/my-team/index'
      })
    }
  },
  showInfo: function(e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onQuery: function() {
    if (this.data.goods_list && this.data.goods_list.current_page >= this.data.goods_list.last_page) {
      this.setData({ last: true })
      return
    }
    let next = !this.data.goods_list ? 1 : this.data.goods_list.current_page + 1
    api.groupBuyQuery(this.data.goods_name, next).then(res => {
      if (this.data.goods_list.length !== 0) res.data = this.data.goods_list.data.concat(res.data)
      this.setData({ goods_list: res, last: res.current_page === res.last_page})
    })
  }
})