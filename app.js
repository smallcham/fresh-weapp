//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.hideTabBar();
    //获取机型
    wx.getSystemInfo({
      success: function(e) {
        console.log(e)
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // let that = this
        // wx.request({
        //   url: this.globalApi.host + this.globalApi.token,
        //   method: 'POST',
        //   data: {
        //     code: res.code
        //   },
        //   success: function (data) {
        //     data = data.data
        //     if (data.state) {
        //       try {
        //         wx.setStorageSync('token', data.data)
        //       } catch (e) {
        //         console.log('存储token失败', data)  
        //       }
        //     } else {
        //       console.log('登录失败', data)
        //     }
        //   }
        // })
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
              console.log(res.userInfo)
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
    
    this.animation = animation;

    var QQMapWX = require('/libs/qqmap-wx-jssdk.min.js');
    this.qqmapsdk = new QQMapWX({
      key: 'BACBZ-KQJ6G-NIKQW-IDZQ4-X4HHT-H5BGP'
    });
  },
  cartAnimation: function(target, isSetData=true) {
    const that = this
    const tabbar = target.getTabBar();
    this.animation.rotate(15).step()
    this.animation.rotate(-15).step()
    this.animation.rotate(0).step()
    wx.nextTick(() => {
      tabbar.setData({
        animationData: {},
      })
    })
    tabbar.setData({
      animationData: this.animation.export(),
      cartCount: tabbar.data.cartCount + 1
    })
  },
  is_null: function(target) {
    return null === target || undefined === target || '' === target;
  },
  getLocation: function (target, poi = 0, options = null) {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            success: function (e) {
              that.qqmapsdk.reverseGeocoder({
                location: {
                  latitude: e.latitude,
                  longitude: e.longitude
                },
                get_poi: poi,
                poi_options: options,
                success: function (res) {
                  console.log(res)
                  if (res.status == 0) {
                    that.globalData.location = res.result;
                    target.setData({
                      location: res.result
                    })
                  }
                },
                fail: function (res) {
                  console.log(res)
                  that.setData({
                    location: 位置获取失败
                  })
                },
                complete: function() {
                }
              })
            }
          })
        }
      }
    })
  },
  globalApi: {
    host: 'https://www.llfresh.cn/api/mini/',
    token: 'token',
    test: 'test'
  },
  globalData: {
    userInfo: null,
    loading: false,
    location: {"title": "地理位置获取中"},
    TabCur: 0,
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