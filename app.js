//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.hideTabBar();
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  //初始化购物车动画
    const animation = wx.createAnimation({
      duration: 60,
      timingFunction: 'linear',
    })
    this.animation = animation
  },
  cartAnimation: function(target, isSetData=true) {
    this.animation.rotate(15).step()
    this.animation.rotate(-15).step()
    this.animation.rotate(0).step()
    const tabbar = target.getTabBar();
    tabbar.setData({
      animationData: this.animation.export(),
      cartCount: tabbar.data.cartCount + 1
    })
  },
  globalData: {
    userInfo: null,
    goodsCata: [
      { text: "热卖", id: 0 },
      { text: "上新", id: 1 },
      { text: "水果", id: 2 },
      { text: "蔬菜", id: 3 },
      { text: "轻食", id: 4 },
      { text: "肉蛋", id: 5 },
      { text: "海鲜", id: 6 },
      { text: "河鲜", id: 7 },
      { text: "粮油", id: 8 },
      { text: "特产", id: 9 },
      { text: "酒饮", id: 10 },
      { text: "测试1", id: 11 },
      { text: "测试2", id: 12 },
      { text: "测试3", id: 13 },
      { text: "测试4", id: 14 }
    ],
    color: {
      primary: "#2C3E50",
      lightprimary: "#5cadff",
      darkprimary: "#2b85e4",
      info: "#3498DB",
      success: "#18BC9C",
      warning: "#F39C12",
      danger: "#E74C3C",
      title: "#1c2438",
      content: "#495060",
      muted: "#95a5a6",
      disabled: "#bbbec4",
      background: "#f8f8f9",
      divide: "#e9eaec",
      border: "#dddee1"
    }
  }
})