import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import api from '../../api/api'

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    active: 0,
    access: app.globalData.access_location,
    border: false,
    location: app.globalData.location,
    selected_location: app.globalData.selected_location,
    house: app.globalData.house,
    no_house: false,
    house_msg: '',
    userInfo: {},
    loading: app.globalData.loading,
    hasUserInfo: false,
    animationData: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goodsCata: app.globalData.goodsCata,
    indexCata: [
      {
        title: "乳品酒饮",
        img: "https://img10.yiguoimg.com/d/items/2019/190220/9570212329662036_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 0
      },
      {
        title: "新鲜水果",
        img: "https://img11.yiguoimg.com/d/items/2019/190220/9570212329694804_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 1
      },
      {
        title: "美护日百",
        img: "https://img14.yiguoimg.com/d/items/2019/190220/9570212329727572_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 2
      },
      {
        title: "休闲零食",
        img: "https://img09.yiguoimg.com/d/items/2019/190220/9570212329760340_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 3
      },
      {
        title: "速食粮油",
        img: "https://img14.yiguoimg.com/d/items/2019/190220/9570212329793108_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 4
      },
      {
        title: "会员专区",
        img: "https://img11.yiguoimg.com/d/items/2019/190220/9570212329825876_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 5
      },
      {
        title: "好物拼团",
        img: "https://img12.yiguoimg.com/d/items/2019/190220/9570212329858644_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 6
      },
      {
        title: "邀请有礼",
        img: "https://img12.yiguoimg.com/d/items/2019/190220/9570212329891412_144.png?w=144&h=144",
        url: "/pages/cata/index",
        id: 7
      }
    ],
    homeCata: [
      {
        id: 0,
        title: "周末特价肉蛋熟食",
        icon: { name: "hot", color: "text-danger"},
        goodsList: [
          {
            goodsCode: "A001",
            img: "https://img11.yiguoimg.com/d/items/2018/180808/9288728030094600_300.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 5.15,
            originalPrice: 11.15
          },
          {
            goodsCode: "A002",
            img: "https://img11.yiguoimg.com/d/items/2018/180130/9288718841259070_300.jpg",
            goodsName: "新西兰半壳青口贝",
            price: 15.15,
            originalPrice: 31.3
          },
          {
            goodsCode: "A003",
            img: "https://img11.yiguoimg.com/e/items/2017/170616/9288709172830928_220.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 39,
            originalPrice: 41.15
          },
          {
            goodsCode: "A004",
            img: "https://img10.yiguoimg.com/d/items/2018/181127/9288734594147707_300.jpg",
            goodsName: "冰烤地瓜",
            price: 5.15,
            originalPrice: 11.15
          },
          {
            goodsCode: "A005",
            img: "https://img11.yiguoimg.com/d/items/2018/180808/9288728030094600_300.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 100,
            originalPrice: 168
          },
          {
            goodsCode: "A001",
            img: "https://img11.yiguoimg.com/d/items/2018/180808/9288728030094600_300.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 5.15,
            originalPrice: 11.15
          }
        ]
      },
      {
        id: 1,
        title: "周末特价海鲜水产",
        right: "",
        goodsList: [
          {
            goodsCode: "A001",
            img: "https://img11.yiguoimg.com/e/items/2017/170616/9288709172929232_220.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 5.15,
            originalPrice: 11.15
          },
          {
            goodsCode: "A002",
            img: "https://img09.yiguoimg.com/e/items/2017/170616/9288709172863696_220.jpg",
            goodsName: "新西兰半壳青口贝",
            price: 15.15,
            originalPrice: 31.3
          },
          {
            goodsCode: "A003",
            img: "https://img12.yiguoimg.com/e/items/2017/170619/9288709271954131_220.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 39,
            originalPrice: 41.15
          },
          {
            goodsCode: "A004",
            img: "https://img10.yiguoimg.com/d/items/2018/181127/9288734594147707_300.jpg",
            goodsName: "冰烤地瓜",
            price: 5.15,
            originalPrice: 11.15
          },
          {
            goodsCode: "A005",
            img: "https://img11.yiguoimg.com/d/items/2018/180808/9288728030094600_300.jpg",
            goodsName: "波诺卡加拿大雪花牛肉",
            price: 100,
            originalPrice: 168
          }
        ]
      }
    ]
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
    this.getTabBar().setData({
      selected: 0
    })
    const that = this
    Toast.loading({
      mask: false,
      message: '定位中'
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          app.globalData.access_location = 'true'
          that.setData({ access: 'true' })
          app.getLocation(that, 0, true);
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              app.globalData.access_location = 'true'
              that.setData({ access: 'true' })
              app.getLocation(that, 0, true);
            },
            fail() {
              app.globalData.access_location = 'false'
              that.setData({ access: 'false' })
            }
          })
        }
      }
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
  onChangeHomeTab: function(e) {
    app.globalData.TabCur = this.data.goodsCata[e.detail.index].cata_code
    wx.switchTab({
      url: '/pages/cata/index',
    })
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
      selected: 0
    })
    //地址切换后需要更新仓库信息
    if (JSON.stringify(this.data.selected_location) !== JSON.stringify(app.globalData.selected_location)) {
      if (!app.globalData.selected_location) {
        app.getLocation(this, 0, true)
      } else {
        this.getHouse(app.globalData.selected_location.adcode, app.globalData.selected_location.latitude, app.globalData.selected_location.longitude)
      }
    }
    this.setData({
      active: 0,
      location: app.globalData.location,
      selected_location: app.globalData.selected_location,
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
  openSearch: function () {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  openLocation: function () {
    wx.navigateTo({
      url: '/pages/location/index',
    })
  },
  openScan: function() {
    console.log("scan")
  },
  openCata: function(e) {
    if (e.currentTarget.dataset.url === '/pages/cata/index') {
      app.globalData.TabCur = e.currentTarget.dataset.id
      wx.switchTab({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  accessLocation () {
    const that = this
    wx.openSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          app.globalData.access_location = 'true'
          that.setData({ access: 'true' })
          app.getLocation(that)
        }
      }
    })
  },
  checkLocation () {
    
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.getCata()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  getHouse: function(city, lat, lng) {
    api.get(app.globalApi.get_house, { data: { city: city, to: (lat + ',' + lng) } }).then(res => {
      Toast.clear();
      console.log(res)
      app.globalData.house = res
      this.setData({
        house: res,
        no_house: false,
        house_msg: ''
      })
      this.house = res
      this.getCata()
    }).catch(err => {
      this.setData({
        no_house: true,
        house_msg: err
      })
    })
  },
  getMarketing() {
    api.get(app.globalApi.get_house, { data: { city: city, to: (lat + ',' + lng) } }).then(res => {
      Toast.clear();
      console.log(res)
      app.globalData.house = res
      this.setData({
        house: res,
        no_house: false,
        house_msg: ''
      })
      this.house = res
    }).catch(err => {
      this.setData({
        no_house: true,
        house_msg: err
      })
    })
  },
  getCata: function() {
    api.get(app.globalApi.cata_list, { rest: this.data.house.id }).then(res => {
      Toast.clear();
      app.globalData.goodsCata = res
      this.setData({ goodsCata: res })
      if (res.length > 0) app.globalData.TabCur = res[0].cata_code
      else {
        this.setData({ no_house: true, house_msg: '该区域配送服务搭建中，敬请期待。您可以' })
      }
    }).catch(err => {
      Toast.fail('数据加载失败，请刷新重试或重新打开小程序');
    })
  }
})
