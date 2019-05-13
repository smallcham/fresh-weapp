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
    this.login()
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
    
    this.animation = animation;

    var QQMapWX = require('/libs/qqmap-wx-jssdk.min.js');
    this.qqmapsdk = new QQMapWX({
      key: this.globalData.map_key
    });
  },
  cartAnimation: function(target, isSetData=true) {
    const that = this
    const tabbar = target.getTabBar();
    this.animation.scale(1.2).step()
    this.animation.scale(1).step()
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
  _getLocation: function (target, poi = 0, get_house = false, options = null) {
    const that = this
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
            if (res.status == 0) {
              that.globalData.location = res.result;
              if (get_house) target.getHouse(res.result.ad_info.adcode, res.result.location.lat, res.result.location.lng)
              target.setData({
                location: res.result
              })
            }
          },
          fail: function (res) {
            that.setData({
              location: 位置获取失败
            })
          },
          complete: function () {
          }
        })
      }
    })
  },
  login: function() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let that = this
        wx.request({
          url: this.globalApi.host + this.globalApi.token,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (data) {
            data = data.data
            if (data.state) {
              try {
                wx.setStorageSync('token', data.data)
              } catch (e) {
                console.log('存储token失败', data)
              }
            } else {
              console.log('登录失败', data)
            }
          }
        })
      }
    })
  },
  getLocation: function (target, poi = 0, get_house = false, options = null) {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          that.globalData.access_location = 'true'
          that._getLocation(target, poi, get_house, options)
        }
      }
    })
  },
  shareCallBack: function() {
    if (this.globalData.shareBack) {
      let url = this.globalData.shareBack
      this.globalData.shareBack = false
      wx.navigateTo({
        url: url
      })
    }
  },
  addressToLocation: function(addr) {
    return {
      adcode: addr.city_code,
      title: addr.title,
      addr: addr.address,
      district: addr.district,
      city: addr.city,
      latitude: addr.lat,
      longitude: addr.lng
    }
  },
  globalApi: {
    host: 'https://www.llfresh.cn/api/mini/',
    token: 'token',
    reg: 'reg',
    get_phone: 'phone',
    get_house: 'distance',
    cata_list: 'cata/list',
    query_goods: 'house/goods/query',
    get_goods: 'house/goods/get',
    get_mkt: 'mkt/get',
    get_link: 'house/link/list',
    cart_list: 'cart/show',
    cart_available_list: 'cart/show/available',
    cart_add: 'cart/add',
    cart_del: 'cart/del',
    cart_del_checked: 'cart/del/checked',
    cart_count: 'cart/count',
    cart_touch: 'cart/touch',
    cart_checked: 'cart/checked',
    add_addr: 'address/add',
    modify_addr: 'address/modify',
    query_addr: 'address/show',
    get_addr: 'address/get',
    del_addr: 'address/del',
    near_addr: 'address/near',
    first_addr: 'address/first',
    vip_plans: 'vip/list',
    vip_open: 'vip/open',
    get_user: 'mine',
    create_pay: 'pay/create',
    create_order: 'order/create',
    query_order: 'order/query',
    get_order: 'order/get',
    get_order_count: 'order/state/count',
    cancel_order: 'order/cancel',
    query_coupon: 'coupon/query',
    query_effective_coupon: 'coupon/query/effective',
    choose_coupon: 'coupon/choose',
    auto_choose_coupon: 'coupon/auto/choose'
  },
  globalData: {
    fs: 'http://fs.llfresh.cn/',
    map_key: 'BACBZ-KQJ6G-NIKQW-IDZQ4-X4HHT-H5BGP',
    userInfo: null,
    house: false,
    servicePhone: '18897929159',
    selected_location: false,
    selected_address: false,
    loading: false,
    access_location: 'req',
    shareBack: false,
    location: {"title": "地理位置获取中"},
    TabCur: 0,
    goodsCata: [],
    color: {
      primary: "#2C3E50",
      lightprimary: "#5cadff",
      darkprimary: "#2b85e4",
      info: "#3498DB",
      success: "#18BC9C",
      successa: "rgba(24, 188, 155, 0.116)",
      successdisable: "rgba(24, 188, 155, 0.300)",
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
  },
  tempData: {}
})