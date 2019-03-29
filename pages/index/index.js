import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    animationData: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goodsCata: app.globalData.goodsCata
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      color: app.globalData.color
    })
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onChange: function (event) {
    if (event.detail === 0) {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
    else if (event.detail === 3) {
      wx.navigateTo({
        url: '/pages/cart/index',
      })
    }
  },
  showInfo: function(e) {
    wx.navigateTo({
      url: '/pages/info/index',
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    })
  },
  onShow: function(e) {
    this.getTabBar().setData({
      active: 0
    })
  },
  addCart: function(e) {
    app.cartAnimation(this)
    Notify({
      text: '已加入购物车',
      duration: 1000,
      selector: '#custom-notify',
      backgroundColor: this.data.color.success
    });
  },
  openSearch: function() {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  }
})
