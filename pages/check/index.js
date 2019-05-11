// pages/check/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import api from '../../api/api'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: '填写订单',
    loading: true,
    fs: app.globalData.fs,
    selected_address: app.globalData.selected_address,
    showTimePicker: false,
    selectedTime: '',
    chooseCoupon: false,
    house: app.globalData.house,
    goods_list: [], 
    total: 0.0, 
    original: 0.0, 
    discount: 0.0, 
    is_vip: false,
    timeColumns: ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00']
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      color: app.globalData.color,
      house: app.globalData.house,
      selectedTime: this.data.timeColumns[0]
    })
    this.getAvailableCart()
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
    this.setData({
      selected_address: app.globalData.selected_address
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
  toCheck: function() {
    if (app.globalData.selected_address === undefined || app.globalData.selected_address === false || app.globalData.selected_address === null) {
      Dialog.alert({
        title: '轻果提醒',
        message: '请选择收货地址'
      }).then(() => {
        // on close
      });
      return false
    }
    Toast.loading({
      mask: true
    });
    api.createOrder().then(res => {
      if (null === res || undefined === res) {
        Dialog.alert({
          title: '轻果提醒',
          message: '创建订单失败，请稍候重试或联系客服'
        }).then(() => {})
        Toast.clear()
        return false
      }
      wx.navigateTo({
        url: '/pages/order-info/index?auto=1&order_code=' + res
      })
    }).catch(err => {
      Dialog.alert({
        title: '轻果提醒',
        message: err
      }).then(() => { })
      Toast.clear()
      return false
    })
  },
  chooseAddress: function() {
    wx.navigateTo({
      url: '/pages/my-address/index'
    })
  },
  openGoodsList: function() {
    if (undefined === this.data.goods_list || this.data.goods_list.length === 0) return false
    app.tempData.goods_list = this.data.goods_list
    wx.navigateTo({
      url: '/pages/goods-list/index'
    })
  },
  openTimePicker: function() {
    this.setData({ showTimePicker: true })
  },
  onPickTimeConfirm(event) {
    const { picker, value, index } = event.detail;
    this.setData({ showTimePicker: false, selectedTime: value })
  },
  onPickTimeCancel() {
    this.setData({ showTimePicker: false })
  },
  getAvailableCart: function() {
    api.getAvailableCart().then(res => {
      if (null === res || undefined === res || res.carts.length < 1) {
        Dialog.alert({
          title: '轻果提醒',
          message: '当前地址对应的购物车商品无效或为空，无法结算，请更换地址或修改购物车商品'
        }).then(() => {
        });
        this.setData({ loading: false })
        return false
      }
      this.setData({ goods_list: res.carts, sum: res.sum, total: res.total, original: res.original, discount: res.discount, is_vip: res.is_vip })
      api.autoChooseCoupon().then(coupon => {
        if (null === coupon || undefined === coupon) {
          this.setData({ loading: false })
          return false
        }
        this.setData({ chooseCoupon: coupon, total: this.data.total - coupon.discount_amount, loading: false })
      })
    })
  }
})