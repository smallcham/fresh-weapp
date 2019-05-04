import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import api from '../../api/api'
const app = getApp()
// pages/info/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    fs: app.globalData.fs,
    cartCount: 0,
    id: null,
    share: false,
    loading: true,
    goodsInfo: {},
    showFoot: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.data.share = options.share === '1'
    this.setData({
      color: app.globalData.color
    })
    api.countCart().then(res => {
      this.setData({ cartCount: (null === res || undefined === res) ? 0 : Number(res) })
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
    if (this.data.share) {
        this.data.share = false
        app.globalData.shareBack = '/pages/info/index?id=' + this.data.id
        wx.switchTab({
          url: '/pages/index/index'
        })
    } else {
      this.getGoods()
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
    return {
      title: this.data.goodsInfo.goods_name,
      path: '/pages/info/index?id=' + this.data.id + '&share=1',
      success: function (res) {
      },
      fail: function (res) {}
    }
  },

  onAddCart: function(e) {
    api.addCart(this.data.id, 1).then(res => {
      this.setData({ 
        cartCount: (null === this.data.cartCount || undefined === this.data.cartCount) ? 0 :  Number(this.data.cartCount) + 1
      })
    }).catch(err => { Toast.fail(err); })
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
      this.setData({ goodsInfo: res, loading: false })
    }).catch(err => {
      Toast.fail(err);
      wx.navigateBack({})
    })
  }
})