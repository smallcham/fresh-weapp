//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.hideTabBar();
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

    var QQMapWX = require('/libs/qqmap-wx-jssdk.min.js');
    // var Amap = require('/libs//amap-wx.js');
    // this.amap = new Amap.AMapWX({ key: 'bc3c26bece30a5037f477aea3eef6172' });

    this.qqmapsdk = new QQMapWX({
      key: this.globalData.map_key
    });
  },
  cartAnimation: function(target, isSetData=true) {
    //购物车动画
    const that = this
    const tabbar = target.getTabBar();
    let animation = wx.createAnimation({
      duration: 60,
      timingFunction: 'linear',
    })
    animation.rotate(15).scale(1.1).step()
    animation.rotate(0).step()
    animation.rotate(-15).step()
    animation.rotate(0).scale(1).step()
    tabbar.setData({
      animationData: animation.export(),
      cartCount: tabbar.data.cartCount + 1
    })
    wx.nextTick(() => {
      target.getTabBar().setData({
        animationData: {},
      })
    })
  },
  is_null: function(target) {
    return null === target || undefined === target || '' === target;
  },
  _getLocation: function (target, poi = 0, get_house = false, options = null) {
    // const that = this
    // this.amap.getRegeo({
    //   success: function (data) {
    //     if (null === data || undefined === data || data.length <= 0) {
    //       that.setData({ location: '位置获取失败' })
    //       return
    //     }
    //     console.log(data)
    //   },
    //   fail: function (info) {
    //     console.log(info)
    //     that.setData({ location: '位置获取失败' })
    //   }
    // })

    const that = this
    wx.getLocation({
      success: function (e) {
        that.qqmapsdk.reverseGeocoder({
          location: {
            latitude: e.latitude,
            longitude: e.longitude
          },
          get_poi: poi,
          poi_options: poi !== 0 ? 'policy=2;radius=3000;page_size=15;page_index=1' : null,
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
  login: function(call) {
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
                if (undefined !== call) { call() }
              } catch (e) {
                console.log('存储token失败', data, e)
              }
            } else {
              console.log('登录失败', data)
            }
            //获取机型
            wx.getSystemInfo({
              success: function (e) {
                wx.request({
                  url: that.globalApi.host + that.globalApi.device,
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'LL-Token': data.data
                  },
                  data: {
                    device: e
                  },
                  success: function(data) {}
                })
              }
            })
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
  get_query_var(url) {
    var query = url.split('?');
      if(query.length < 2) return [];
      var vars = query[1].split("&");
      let result = []
      for(var i = 0; i<vars.length;i++) {
        var pair = vars[i].split("=");
        result.push(pair)
      }
    return result;
  },
  clickLink: function(url, type) {
    if (null === url || undefined === url) return false
    if (type === 0) {
      let params = this.get_query_var(url)
      for(let i = 0; i < params.length; i ++) {
        this.globalData[params[i][0]] = params[i][1]
      }
      wx.switchTab({ url: url.split('?')[0] })
    }
    else if (type === 1) {
      wx.reLaunch({
        url: url
      })
    }
    else if (type === 2) {
      wx.redirectTo({
        url: url
      })
    }
    else if (type === 3) {
      wx.navigateTo({
        url: url
      })
    }
    else if (type === 4) {
      wx.navigateBack({})
    }
    else if (type === 5) {

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
    root: 'https://www.llfresh.cn/',
    host: 'https://www.llfresh.cn/api/mini/',
    token: 'token',
    reg: 'reg',
    device: 'device/put',
    search_info: 'search/info',
    search_clear: 'search/clear',
    get_phone: 'phone',
    check_phone: 'check/phone',
    get_run_data: 'run/data',
    get_house: 'distance',
    cata_list: 'cata/list',
    recommend_goods: 'goods/recommend',
    query_goods: 'house/goods/query',
    get_goods: 'house/goods/get',
    get_mkt: 'mkt/get',
    get_mkt_goods: 'mkt/goods/list',
    get_link: 'house/link/list',
    cart_list: 'cart/show',
    cart_delivery_check: 'cart/delivery/check',
    cart_available_list: 'cart/show/available',
    cart_add: 'cart/add',
    cart_del: 'cart/del',
    cart_del_checked: 'cart/del/checked',
    cart_count: 'cart/count',
    cart_touch: 'cart/touch',
    cart_checked: 'cart/checked',
    cart_again: 'cart/again',
    add_addr: 'address/add',
    modify_addr: 'address/modify',
    query_addr: 'address/show',
    get_addr: 'address/get',
    del_addr: 'address/del',
    near_addr: 'address/near',
    global_near_addr: 'address/global/near',
    first_addr: 'address/first',
    vip_plans: 'vip/list',
    vip_open: 'vip/open',
    get_user: 'mine',
    create_pay: 'pay/create',
    create_order: 'order/create',
    create_group_order: 'order/group/create',
    buy_vip_create_order: 'order/buy/vip/create',
    query_order: 'order/query',
    feedback_order: 'order/feedback',
    get_order: 'order/get',
    get_order_count: 'order/state/count',
    get_order_progress: 'order/progress',
    apply_refund: 'order/refund/apply',
    query_refund: 'order/refund/apply/query',
    cancel_order: 'order/cancel',
    confirm_deliver: 'order/confirm/deliver',
    query_coupon: 'coupon/query',
    query_effective_coupon: 'coupon/query/effective',
    count_effective_coupon: 'coupon/count/effective',
    choose_coupon: 'coupon/choose',
    auto_choose_coupon: 'coupon/auto/choose',
    upload_img: 'upload/img',
    query_coin: 'coin/query/log',
    query_exchange_item: 'coin/exchange/list',
    exchange_item: 'coin/exchange/item',
    lower_exchange_item: 'coin/lower/exchange/item',
    add_question: 'question/add',
    create_red_paper: 'paper/create',
    take_red_paper: 'paper/take',
    get_red_paper: 'paper/info',
    get_locus: 'express/order/locus',
    group_buy_query: 'group/buy/query',
    group_buy_info: 'group/buy/info',
    group_query_team: 'group/buy/team/random',
    group_team_info: 'group/buy/team/info'
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
    not_use_coupon: false,
    use_coupon: false,
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
      muteda: "rgba(149, 165, 166, 0.247)",
      disabled: "#bbbec4",
      background: "#f8f8f9",
      divide: "#e9eaec",
      border: "#dddee1"
    }
  },
  tempData: {}
})