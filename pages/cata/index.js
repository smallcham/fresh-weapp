// pages/list/index.js
const app = getApp()
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import api from '../../api/api'

Page({

  /**
   * Page initial data
   */
  data: {
    title: "分类",
    fs: app.globalData.fs,
    selected_location: false,
    location: app.globalData.location,
    loading: app.globalData.loading,
    loading_list: true,
    empty_list: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: app.globalData.TabCur,
    VerticalNavTop: 0,
    last_top: 0,
    now_page: 1,
    goodsList: [],
    goodsCata: app.globalData.goodsCata
  },
  tabSelect(e) {
    app.globalData.TabCur = e.currentTarget.dataset.id
    this.data.TabCur = e.currentTarget.dataset.id,
    this.setData({
      empty_list: false,
      goodsList: [],
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
    this.getGoodsList()
  },
  VerticalMain(e) {
    console.log(this.data.now_page);
    if ((e.detail.scrollTop >= e.detail.scrollHeight / (this.data.now_page * 2)) && e.detail.scrollTop > this.data.last_top) {
      this.data.last_top = e.detail.scrollTop
      this.data.now_page = this.data.now_page + 1
      console.log('load more...')
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      TabCur: app.globalData.TabCur,
      goodsCata: app.globalData.goodsCata,
      color: app.globalData.color
    })
    this.getTabBar().setData({
      selected: 1
    })
    this.getGoodsList()
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
    let needLoad = this.data.TabCur !== app.globalData.TabCur
    this.data.TabCur = app.globalData.TabCur
    if (needLoad) this.getGoodsList()
    if (JSON.stringify(this.data.selected_location) !== JSON.stringify(app.globalData.selected_location)) {
      this.getHouse(app.globalData.selected_location.adcode, app.globalData.selected_location.latitude, app.globalData.selected_location.longitude)
    } else {
      this.setData({
        location: app.globalData.location,
        selected_location: app.globalData.selected_location,
        goodsCata: app.globalData.goodsCata,
        TabCur: app.globalData.TabCur
      })
    }
    this.getTabBar().setData({
      selected: 1
    })
    api.countCart().then(res => {
      this.getTabBar().setCartCount((null === res || undefined === res) ? 0 : Number(res))
    })
    wx.setNavigationBarTitle({
      title: this.data.title,
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
    return {
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
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
  getGoodsList: function() {
    this.setData({ loading_list: true })
    api.get(app.globalApi.query_goods, { data: { cata: this.data.TabCur, goods_name: '' } }).then(res => {
      console.log(res)
      this.setData({
        empty_list: res.total === 0,
        goodsList: res,
        loading_list: false
      })
    }).catch(err => {})
  },
  showInfo: function(e) {
    wx.navigateTo({
      url: '/pages/info/index?id=' + e.currentTarget.dataset.id,
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
  getHouse: function (city, lat, lng) {
    api.get(app.globalApi.get_house, { data: { city: city, to: (lat + ',' + lng) } }).then(res => {
      app.globalData.house = res
      this.getCata()
      api.nearAddr(res.id).then(res => {
        if (null !== res && undefined !== res) {
          app.globalData.selected_address = res
          app.globalData.selected_location = app.addressToLocation(res)
        }
        this.setData({
          selected_location: app.globalData.selected_location,
          location: app.globalData.location,
          goodsCata: app.globalData.goodsCata,
          TabCur: app.globalData.TabCur
        })
      })
    }).catch(err => { })
  },
  getCata: function () {
    api.get(app.globalApi.cata_list).then(res => {
      app.globalData.goodsCata = res
      if (res.length > 0) { 
        app.globalData.TabCur = res[0].cata_code
        this.setData({ goodsCata: res, TabCur: app.globalData.TabCur, })
        this.getGoodsList()
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }).catch(err => {
      Toast.fail('数据加载失败，请刷新重试或重新打开小程序');
    })
  },
})