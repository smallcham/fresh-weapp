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
  },
  globalData: {
    userInfo: null,
    color: {
      primary: "#2d8cf0",
      lightprimary: "#5cadff",
      darkprimary: "#2b85e4",
      info: "#2d8cf0",
      success: "#18BC9C",
      warning: "#ff9900",
      danger: "#ed3f14",
      title: "#1c2438",
      content: "#495060",
      muted: "#80848f",
      disabled: "#bbbec4",
      background: "#f8f8f9",
      divide: "#e9eaec",
      border: "#dddee1"
    }
  }
})