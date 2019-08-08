import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import api from '../../api/api'
import util from '../../utils/util'
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
    house: false,
    showFoot: true,
    group_buy: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.data.id = options.id
    this.data.share = options.share === '1'
    this.setData({
      color: app.globalData.color,
      house: app.globalData.house
    })
    api.countCart().then(res => {
      this.setData({ cartCount: (null === res || undefined === res) ? 0 : Number(res) })
    })
    if (this.data.share) {
      this.data.share = false
      app.globalData.shareBack = '/pages/info/index?id=' + this.data.id
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      this.getGoods()
    }
    api.recommendGoods().then(res => {
      this.setData({ recommend_list: res })
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
  addCart: function (e) {
    this.onAddCart(e, e.currentTarget.dataset.id)
  },
  showInfo: function (e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onAddCart: function(e, code) {
    api.addCart(undefined !== code ? code : this.data.id, 1).then(res => {
      this.setData({ 
        cartCount: (null === this.data.cartCount || undefined === this.data.cartCount) ? 0 :  Number(this.data.cartCount) + 1
      })
      api.deliveryCheck().then(res => {
        let differ = Number(res.free_delivery_limit - res.total).toFixed(1)
        let text = differ > 0 ?
          ' 实付满 ¥ ' + res.free_delivery_limit + ' 包邮，还差 ¥ ' + differ + ' 元，配送费 ¥ ' + res.delivery_fee :
          ' 实付满 ¥ ' + res.free_delivery_limit + '包邮，当前总额 ¥ ' + res.total + ' 已包邮'
        Notify({
          text: text,
          duration: 3000,
          selector: '#custom-notify',
          backgroundColor: differ > 0 ? app.globalData.color.warning : app.globalData.color.success
        })
      })
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      }) })
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
      res.info_text = (null === res.info_text || undefined === res.info_text) ? '' : res.info_text.split('\n')
      api.groupBuyInfo(this.data.id).then(gb => {
        if (null != gb && undefined != gb) {
          gb.end = gb.end_time <= util.formatTime(new Date())
          gb.unstart = gb.start_time > util.formatTime(new Date())
          this.setData({ goodsInfo: res, loading: false, group_buy: gb })
        }else {
          this.setData({ goodsInfo: res, loading: false, group_buy: false })
        }
      })
    }).catch(err => {
      wx.navigateBack({})
    })
  }
})