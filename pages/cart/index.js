import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import api from '../../api/api'
import util from '../../utils/util'
const app = getApp()
// pages/cart/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    selected_location: false,
    location: app.globalData.location,
    fs: app.globalData.fs,
    loading: true,
    all_pick: true,
    hasInvalid: false,
    effective_count: 0,
    tip: '',
    is_vip: false,
    total: 0,
    save: 0,
    carts: [],
    invalid: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      color: app.globalData.color
    })
    this.getTabBar().setData({
      selected: 3
    })
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
    Toast.loading({
      mask: false
    });
    this.setData({ is_vip: util.formatTime(new Date()) < app.globalData.mine.vip_expire_time })
    if (JSON.stringify(this.data.selected_location) !== JSON.stringify(app.globalData.selected_location)) {
      this.getHouse(app.globalData.selected_location.adcode, app.globalData.selected_location.latitude, app.globalData.selected_location.longitude)
    } else {
      this.cartList()
      this.setData({
        location: app.globalData.location,
        selected_location: app.globalData.selected_location
      })
    }
    this.getTabBar().setData({
      selected: 3
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
    Toast.loading({
      mask: false
    });
    wx.showNavigationBarLoading()
    this.cartList()
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
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
  },
  onReduce: function(e) {
    if (e.detail === 'minus') {
      Dialog.confirm({
        title: '提示',
        message: '您确定要删除该商品吗'
      }).then(() => {
        api.touchCart(e.currentTarget.dataset.code, 0).then(res => {
          this.data.carts.splice(e.currentTarget.dataset.idx, 1)
          this.setData({ carts: this.data.carts })
          this.flushState()
        }).catch(err => { })
      }).catch(() => {});
    } else {
      Notify({
        text: '就剩这么多了哦 ~',
        duration: 1000,
        selector: '#custom-notify',
        backgroundColor: this.data.color.warning
      });
    }
  },
  onChangeNum: function(e) {
    api.touchCart(e.currentTarget.dataset.code, e.detail).then(res => {
      this.data.carts[e.currentTarget.dataset.idx].amount = e.detail
      this.flushState()
    }).catch(err => {})
  },
  openLocation: function () {
    wx.navigateTo({
      url: '/pages/location/index'
    })
  },
  toCheck: function() {
    if (this.data.effective_count <= 0) {
      Notify({
        text: '选中商品库存不足',
        duration: 1000,
        selector: '#custom-notify',
        backgroundColor: this.data.color.warning
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/check/index'
    })
  },
  cartList: function() {
    api.get(app.globalApi.cart_list, {}).then(res => {
      this.setData({ carts: res, loading: false })
      this.flushState()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      Toast.clear()
    }).catch(err => { Toast.clear(); this.setData({ loading: false }) })
  },
  showInfo: function (e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
    })
  },
  checkedChange: function(e) {
    Toast.loading({
      mask: false
    });
    let state = e.detail ? 1 : 0
    api.checkedCart([e.currentTarget.dataset.id], state).then(res => { 
      this.data.carts[e.currentTarget.dataset.idx].cart_state = state
      this.flushState()
      this.setData({ carts: this.data.carts }) 
      Toast.clear()
    })
  },
  allPickChange: function(e) {
    Toast.loading({
      mask: false
    });
    let state = e.detail ? 1 : 0
    api.checkedCart([], state, state).then(res => {
      this.cartList()
    })
  },
  delCart: function() {
    Dialog.confirm({
      title: '提示',
      message: '您确定要删除选中的商品吗'
    }).then(() => {
      api.delCartChceked().then(res => {
        this.cartList()
      }).catch(err => { })
    }).catch(() => { })
  },
  flushState: function() {
    let flag = true
    let total = 0.0
    let originalTotal = 0.0
    let save = 0.0
    let isModify = false
    let hasInvalid = false
    this.data.effective_count = 0
    this.data.invalid = []
    for (let i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].inventory === -1) { 
        this.data.invalid.push(this.data.carts[i].cart_code)
        hasInvalid = true
        continue 
      }
      if (this.data.carts[i].amount > this.data.carts[i].inventory) {
        this.data.carts[i].amount = this.data.carts[i].inventory
        if (this.data.carts[i].inventory > 0) { isModify = true; api.touchCart(this.data.carts[i].cart_code, this.data.carts[i].inventory).then(res => { }) }
      }
      if (this.data.carts[i].cart_state === 0) {
        flag = false
      } else {
        if (this.data.carts[i].inventory > 0) {
          this.data.effective_count++
          total += Number(this.data.is_vip ? this.data.carts[i].vip_price : this.data.carts[i].price) * Number(this.data.carts[i].amount)
          originalTotal += Number(this.data.carts[i].original) * Number(this.data.carts[i].amount)
        }
      }
    }
    if (isModify) {
      Notify({
        text: '部分商品库存不足，已自动更新最大可购买数量',
        duration: 2000,
        selector: '#custom-notify',
        backgroundColor: this.data.color.warning
      });
    }
    this.setData({ all_pick: flag, total: total <= 0 ? 0 : total * 100, save: (originalTotal - total).toFixed(1), hasInvalid: hasInvalid})
    api.countCart().then(res => {
      this.getTabBar().setCartCount((null === res || undefined === res) ? 0 : Number(res))
    })
    api.deliveryCheck().then(res => {
      let differ = Number(res.free_delivery_limit - res.total).toFixed(1)
      let text = differ > 0 ?
        ' 实付满 ¥ ' + res.free_delivery_limit + ' 包邮，还差 ¥ ' + differ + ' 元，配送费 ¥ ' + res.delivery_fee :
        ' 符合包邮条件，已免配送费'
      this.setData({ tip: text })
    })
  },
  getHouse: function (city, lat, lng) {
    api.get(app.globalApi.get_house, { data: { city: city, to: (lat + ',' + lng) } }).then(res => {
      app.globalData.house = res
      this.cartList()
      api.nearAddr(res.id).then(res => {
        if (null !== res && undefined !== res) {
          app.globalData.selected_address = res
          app.globalData.selected_location = app.addressToLocation(res)
        }
        this.setData({ selected_location: app.globalData.selected_location, location: app.globalData.location })
      })
    }).catch(err => { })
  },
  deleteInvalid: function() {
    Toast.loading({
      mask: false
    })
    api.delCart(this.data.invalid).then(res => {
      Toast.clear()
      this.cartList()
    })
  },
  addCart: function (e) {
    api.addCart(e.currentTarget.dataset.id, 1).then(res => {
      this.onShow()
    }).catch(err => { Toast.fail(err); })
    Notify({
      text: '已加入购物车',
      duration: 500,
      selector: '#custom-notify',
      backgroundColor: this.data.color.success
    });
  }
})