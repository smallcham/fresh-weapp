// pages/my-team/index.js
import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    title: "超值拼团",
    fs: app.globalData.fs,
    group_info: false,
    shutdown: false,
    share: false,
    ms: false,
    steps: [
      {
        text: '开团',
      },
      {
        text: '邀请好友',
      },
      {
        text: '限定时间内成团',
      },
      {
        text: '发货',
      }
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.data.order_code = options.order_code
    this.data.share = '1' === options.share
    if (this.data.share) {
      this.data.share = false
      app.globalData.shareBack = '/pages/my-team/index?order_code=' + this.data.order_code
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      api.groupTeamInfo(this.data.order_code, true).then(res => {
        this.setData({ now: util.formatTime(new Date()), color: app.globalData.color, group_info: res })
        let that = this
        that.countDown()
        let id = setInterval(function () {
          that.countDown(id)
        }, 1000)
      })
    }
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
    this.data.shutdown = true
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
    return {
      title: '【仅剩' + (this.data.group_info.team.team_size - this.data.group_info.info.length) + '个名额】我用' + this.data.group_info.group.group_price + '元就拼到了【' + this.data.group_info.goods.goods_name + '】',
      path: '/pages/my-team/index?share=1&order_code=' + this.data.order_code,
      imageUrl: app.globalData.fs + this.data.group_info.goods.goods_img
      //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
  toGoods: function() {
    wx.navigateTo({
      url: '/pages/info/index?id=' + this.data.group_info.goods.goods_code,
    })
  },
  onAddGroupBuy: function (e) {
    wx.navigateTo({
      url: '/pages/check/index?check_type=group&goods_code=' + this.data.group_info.goods.goods_code + '&group_id=' + e.currentTarget.dataset.id
    })
  },
  toHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  countDown: function(id) {
    let time = new Date(this.data.group_info.team.end_time.replace(/-/g, '/')).getTime() 
    let now = new Date().getTime()
    let diff = time - now
    if (diff <= 0 || this.data.shutdown) {
      if (null !== id && undefined !== id) clearInterval(id)
      return false
    }
    this.setData({ ms: diff })
  }
})