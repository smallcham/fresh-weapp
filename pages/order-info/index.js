// pages/order-info/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import api from '../../api/api'
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    title: "我的订单",
    fs: app.globalData.fs,
    loading: true,
    login: true,
    blockCancel: false,
    pay_success: false,
    selected_address: {},
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
    let auto = options.auto === "1"
    this.data.auto = options.auto === "1"
    this.data.quick = options.quick
    this.data.order_code = options.order_code
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
    if (this.data.pay_success) wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + this.data.order.order_code })
    if (this.data.quick === '1') {
      this.setData({ login: false })
      app.login(function () {
        this.setData({ login: true })
        this.loadOrder(this.data.order_code, this.data.auto)
      })
    }
    if (!this.data.login) return
    this.loadOrder(this.data.order_code, this.data.auto)
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
    if (this.data.order.is_group !== 1) {
      return {
        title: '轻果鲜生',
        path: '/pages/index/index',
        success: function (res) {
        },
        fail: function (res) { }
      }
    }
    return {
      title: '【仅剩1个名额】我用' + this.data.order.real_pay + '元就拼到了【' + this.data.order.detail[0].goods_name + '】',
      path: '/pages/my-team/index?team_id=' + this.data.order.group_info.team.id,
      imageUrl: app.globalData.fs + this.data.order.detail[0].goods_img
      //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
  callService: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  openGoodsList: function () {
    if (undefined === this.data.order || this.data.order.detail.length === 0) return false
    app.tempData.goods_list = this.data.order.detail
    wx.navigateTo({
      url: '/pages/goods-list/index'
    })
  },
  toPay: function(e) {
    this.setData({ paying: true, blockCancel: true })
    api.pay(e.currentTarget.dataset.id).then(res => {
      this.data.pay_success = true
      wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + order_code })
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
    }).catch(err => {
      if (!err.errMsg === 'requestPayment:fail cancel') {
        Dialog.alert({
          title: '轻果提醒',
          message: err
        }).then(() => { })
      }
      this.setData({ paying: false })
    })
  },
  confirmDeliver: function () {
    let that = this
    Dialog.confirm({
      title: '提示',
      message: '请确认您已收到货'
    }).then(() => {
      api.confirmDeliver(this.data.order_code).then(res => {
        wx.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
        wx.navigateBack({})
      }).catch(err => {
        Dialog.alert({
          title: '提示',
          message: err
        }).then(() => { })
      })
    }).catch(() => { })
  },
  cancelOrder: function() {
    Dialog.confirm({
      title: '提示',
      message: '您确定要放弃该订单吗'
    }).then(() => {
      api.cancelOrder(this.data.order.order_code).then(res => {
        wx.showToast({
          title: '订单已取消',
          icon: 'none'
        })
        wx.navigateBack({})
      }).catch(err => {
        wx.showToast({
          title: err,
          icon: 'none'
        })
      })
    }).catch(() => {})
  },
  addCartAgain: function (e) {
    api.cartAgain(e.currentTarget.dataset.id).then(res => {
      wx.switchTab({ url: '/pages/cart/index' })
    })
  },
  toQuestion: function(e) {
    wx.navigateTo({
      url: '/pages/question/index?type=' + e.currentTarget.dataset.type + '&order_code=' + e.currentTarget.dataset.id
    })
  },
  loadOrder: function(order_code, auto) {
    if (null === app.globalData.mine) {
      api.getUser().then(res => {
        if (null === res) {
          wx.showToast({
            title: '登录失败,请重新打开小程序',
            icon: 'none'
          })
          return
        }
        app.globalData.mine = res
        if (this.loadOrder(order_code, auto))
        return
      })
    } else {
      if (null === app.globalData.mine.phone || '' === app.globalData.mine.phone || undefined === app.globalData.mine.phone) {
        this.toCheckPhone()
      } else {
        api.getOrder(order_code).then(res => {
          if (null === res || undefined === res) wx.navigateBack({})
          res.deliver_info = JSON.parse(res.deliver_info)
          let _time = new Date(res.deliver_end_time)
          let _now = new Date()
          let _year = _now.getFullYear() + '-' + (_now.getMonth() + 1) + '-' + _now.getDate()
          let _deliver_year = _time.getFullYear() + '-' + (_time.getMonth() + 1) + '-' + _time.getDate()
          res.deliver_time_label = (_year === _deliver_year ? '今' : _deliver_year) + '日 ' + _time.getHours() + ':' + (_time.getMinutes() < 10 ? '0' + _time.getMinutes() : _time.getMinutes()) + ' 前 '
          let sum = 0
          for (let i = 0; i < res.detail.length; i++) sum += res.detail[i].amount
          this.setData({
            loading: false,
            paying: auto,
            order: res,
            color: app.globalData.color,
            sum: sum,
            selected_address: app.globalData.selected_address
          })
          if (auto && res.order_state === 0) {
            this.setData({ auto: false, blockCancel: true })
            api.pay(order_code).then(res => {
              this.setData({ paying: false })
              this.data.pay_success = true
              wx.reLaunch({ url: '/pages/pay-success/index?order_code=' + order_code })
            }).catch(err => {
              if (!err.errMsg === 'requestPayment:fail cancel') {
                Dialog.alert({
                  title: '轻果提醒',
                  message: err
                }).then(() => { })
              }
              this.setData({ paying: false })
            })
          }
        }).catch(err => {
          Dialog.alert({
            title: '轻果提醒',
            message: err
          }).then(() => { })
          Toast.clear()
        })
      }
    }
  },
  toCheckPhone: function() {
    wx.navigateTo({
      url: '/pages/bind-phone/index'
    })
  }
})