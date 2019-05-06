import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import api from '../../api/api'

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    fs: app.globalData.fs,
    active: 0,
    access: app.globalData.access_location,
    border: false,
    loading_mkt: true,
    location: app.globalData.location,
    selected_location: app.globalData.selected_location,
    house: app.globalData.house,
    no_house: false,
    house_msg: '',
    mkt_list: [],
    userInfo: {},
    loading: app.globalData.loading,
    hasUserInfo: false,
    animationData: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goodsCata: app.globalData.goodsCata,
    banner: [],
    indexCata: []
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
      selected: 0,
      show: false
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
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
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
    if (this.data.house !== false) { app.shareCallBack() }
    //地址切换后需要更新仓库信息
    if (JSON.stringify(this.data.selected_location) !== JSON.stringify(app.globalData.selected_location)) {
      if (!app.globalData.selected_location) {
        app.getLocation(this, 0, true)
      } else {
        this.getHouse(app.globalData.selected_location.adcode, app.globalData.selected_location.latitude, app.globalData.selected_location.longitude)
      }
    }
    api.countCart().then(res => {
      this.getTabBar().setCartCount((null === res || undefined === res) ? 0 : Number(res))
    })
    this.setData({
      active: 0,
      location: app.globalData.location,
      selected_location: app.globalData.selected_location,
    })
  },
  addCart: function(e) {
    api.addCart(e.currentTarget.dataset.id, 1).then(res => { 
      this.getTabBar().plusCartCount()
    }).catch(err => { Toast.fail(err);  })
    Notify({
      text: '已加入购物车',
      duration: 500,
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
    this.setData({ loading_mkt: true })
    this.getCata()
  },
  getHouse: function(city, lat, lng) {
    api.get(app.globalApi.get_house, { data: { city: city, to: (lat + ',' + lng) } }).then(res => {
      Toast.clear();
      app.globalData.house = res
      app.shareCallBack()
      this.setData({
        house: res,
        no_house: false,
        house_msg: ''
      })
      this.house = res
      api.nearAddr(res.id).then(res => {
        if (null !== res && undefined !== res) {
          app.globalData.selected_address = res
          app.globalData.selected_location = app.addressToLocation(res)
          this.setData({ selected_location: app.globalData.selected_location })
        }
      })
      this.getCata()
    }).catch(err => {
      this.setData({
        no_house: true,
        house_msg: err
      })
    })
  },
  getCata: function() {
    api.get(app.globalApi.cata_list).then(res => {
      Toast.clear();
      app.globalData.goodsCata = res
      this.setData({ goodsCata: res })
      this.getLink()
      this.getMkt()
      if (res.length > 0) app.globalData.TabCur = res[0].cata_code
      else {
        this.setData({ no_house: true, house_msg: '该区域配送服务搭建中，敬请期待。您可以' })
      }
    }).catch(err => {
      console.log('getCata', err)
      Toast.fail('数据加载失败，请刷新重试或重新打开小程序');
    })
  },
  getMkt: function() {
    api.get(app.globalApi.get_mkt).then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      this.setData({ mkt_list: res, loading_mkt: false })
      this.getTabBar().setData({ show: true })
    }).catch(err => {
      console.log('getMkt', err)
      Toast.fail('数据加载失败，请刷新重试或重新打开小程序');
    })
  },
  getLink: function() {
    api.get(app.globalApi.get_link).then(res => {
      if (res === undefined) return
      this.data.banner = []
      this.data.indexCata = []
      for (let i = 0; i < res.length; i++) {
        if (res[i].link_type === 1) this.data.banner.push(res[i])
        else if (res[i].link_type === 0) this.data.indexCata.push(res[i])
        else {}
      }
       this.setData({ banner: this.data.banner, indexCata: this.data.indexCata })
    }).catch(err => {
      console.log('getLink', err)
      Toast.fail('数据加载失败，请刷新重试或重新打开小程序');
    })
  }
})
