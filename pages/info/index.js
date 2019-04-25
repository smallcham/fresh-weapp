import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import api from '../../api/api'
const app = getApp()
// pages/info/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    cartCount: 0,
    id: null,
    goodsInfo: {},
    showFoot: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.data.id = options.id
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
    this.getGoods()
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

  onAddCart: function(e) {
    Notify({
      text: '¥ 29.2 元，还差49.2免配送费',
      duration: 3000,
      selector: '#custom-notify',
      backgroundColor: this.data.color.warning
    });
  },
  onToCart: function(e) {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
  getGoods: function() {
    api.get(app.globalApi.get_goods, { rest: this.data.id }).then(res => {
      res.banner = JSON.parse(res.banner)
      res.info_img = JSON.parse(res.info_img)
      res.info_text = res.info_text.split('\n')
      this.setData({ goodsInfo: res })
    }).catch(err => {
      Toast.fail(err);
      wx.navigateBack({})
    })
  }
})