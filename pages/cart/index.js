import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import api from '../../api/api';
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
    all_pick: true,
    total: 0,
    carts: []
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
    this.cartList()
    this.setData({
      location: app.globalData.location,
      selected_location: app.globalData.selected_location
    })
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
    wx.navigateTo({
      url: '/pages/check/index'
    })
  },
  cartList: function() {
    api.get(app.globalApi.cart_list, {}).then(res => {
      this.setData({ carts: res })
      this.flushState()
      Toast.clear()
    }).catch(err => { Toast.clear() })
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
    let count = 0
    let isModify = false
    for (let i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].amount > this.data.carts[i].inventory) {
        isModify = true
        this.data.carts[i].amount = this.data.carts[i].inventory
        if (this.data.carts[i].inventory !== 0) api.touchCart(this.data.carts[i].cart_code, this.data.carts[i].inventory).then(res => {})
      }
      count += this.data.carts[i].amount
      if (this.data.carts[i].cart_state === 0) {
        flag = false
      } else {
        total += Number(this.data.carts[i].price) * Number(this.data.carts[i].amount)
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
    this.setData({ all_pick: flag, total: total * 100 })
    this.getTabBar().setCartCount(count)
  }
})