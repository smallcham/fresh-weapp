// pages/list/index.js
const app = getApp()
import api from '../../api/api'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'

Page({

  /**
   * Page initial data
   */
  data: {
    id: 0,
    title: '',
    fs: app.globalData.fs,
    cartCount: 0,
    page: false,
    loading: true,
    border: false,
    last: false,
    word: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      title: options.title
    })
    this.deliveryCheck()
    api.countCart().then(res => {
      this.setData({ cartCount: res })
    })
    if (options.type === "search") {
      this.data.word = options.word
      this.queryGoods(options.word, 1)
    } else {
      api.get(app.globalApi.get_mkt_goods, { data: { mkt_code: options.id } }).then(res => {
        this.setData({ goods_list: res, loading: false })
      }).catch(err => { })
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
      title: this.data.title,
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
    if (!page) return
    if (this.data.page.current_page >= this.data.page.last_page || this.data.page.next_page === undefined || this.data.page.next_page === null) {
      this.setData({ last: true })
      return
    } else {
      this.queryGoods(this.data.word, this.data.page.next_page)
    }
  },

  /**
   * Called when user click on the top right corner to share
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
  addCart: function (e) {
    api.addCart(e.currentTarget.dataset.id, 1).then(res => {
      api.countCart().then(res => {
        this.setData({ cartCount: res })
      })
      this.deliveryCheck()
    }).catch(err => { console.log(err) })
  },
  deliveryCheck:function() {
    api.deliveryCheck().then(res => {
      let differ = Number(res.free_delivery_limit - res.total).toFixed(1)
      let text = differ > 0 ?
        ' 实付满 ¥ ' + res.free_delivery_limit + ' 包邮，还差 ¥ ' + differ + ' 元，配送费 ¥ ' + res.delivery_fee :
        ' 实付满 ¥ ' + res.free_delivery_limit + '包邮，当前总额 ¥ ' + res.total + ' 已包邮'
      Notify({
        text: text,
        duration: 0,
        selector: '#van-notify',
        backgroundColor: differ > 0 ? app.globalData.color.warning : app.globalData.color.success
      })
    })
  },
  showInfo: function (e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
    })
  },
  toCart: function() {
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },
  queryGoods: function(word, page=1) {
    api.queryGoods(word, undefined, page).then(res => {
      if (this.data.page !== undefined && this.data.page.data !== undefined) res.data = this.data.page.data.concat(res.data)
      this.setData({ page: res, loading: false, last: res.current_page === res.last_page })
    })
  }
})