// pages/location/index.js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');

Page({

  /**
   * Page initial data
   */
  data: {
    qqmapsdk: {},
    title: "选择地址",
    showAdd: true,
    source: null,
    suggestion: [],
    selected_location: app.globalData.selected_location,
    location: {
      address: "位置获取中"
    },
    border: false
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.source !== undefined) {
      this.setData({
        source: options.source,
        showAdd: options.source !== 'address'
      })
    }
  
    this.qqmapsdk = new QQMapWX({
      key: app.globalData.map_key
    });

    this.setData({
      color: app.globalData.color
    })
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
    app.getLocation(this, 1);
    this.setData({
      location: app.globalData.location,
      selected_location: app.globalData.selected_location
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

  },
  toAddress: function () {
    wx.redirectTo({
      url: '/pages/address/index',
    })
  },
  refresh: function() {
    app.globalData.selected_location = false
    this.setData({
      selected_location: false
    })
    app.getLocation(this, 1);
  },
  onChoose: function(e) {
    this.data.location = this.data.location.pois[e.currentTarget.dataset.index]
    app.globalData.location = this.data.location
    let that = this
    let sel_location = {
      adcode: this.data.location.ad_info.adcode,
      title: this.data.location.title,
      addr: this.data.location.address,
      id: this.data.location.id,
      district: this.data.location.ad_info.district,
      city: this.data.location.ad_info.city,
      latitude: this.data.location.location.lat,
      longitude: this.data.location.location.lng
    }
    app.globalData.selected_location = sel_location
    this.setData({
      selected_location: sel_location
    })
    wx.navigateBack({})
  },
  onChooseCity : function (e) {

  },
  onSearch: function (e) {
    
  },
  //数据回填方法
  backfill: function (e) {
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        console.log(this.data.suggestion[i])
        let choose = this.data.suggestion[i]
        app.globalData.selected_location = choose
        this.setData({
          selected_location: choose,
          suggestion: []
        })
        wx.navigateBack({})
      }
    }
  },
  //触发关键词输入提示事件
  getsuggest: function (e) {
    if (e.detail === null || e.detail === undefined || e.detail === '') {
      this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
        suggestion: []
      });
      return false
    }
    var _this = this;
    //调用关键词提示接口
    this.qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      policy: 1,
      // region: _this.data.location.address_component.city, //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            adcode: res.data[i].adcode,
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
})