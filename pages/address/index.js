// pages/address/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()
// import AreaList from '../../libs/area.js'

Page({

  /**
   * Page initial data
   */
  data: {
    title: '添加收货地址',
    showAreaSheet: false,
    showTypeSheet: false,
    selected_area: 0,
    areaList: {},
    columns: ['住宅', '公司', '学校', '其他'],
    real_name: "",
    phone: "",
    city: "",
    location: "",
    address: "",
    address_type: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let loc = app.globalData.location
    this.setData({
      city: loc.address_component.city + " " + loc.address_component.province + " " + loc.address_component.district, 
      selected_area: app.globalData.location.ad_info.adcode
      // areaList: AreaList
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
    if (app.globalData.selected_location !== undefined ) {
      this.setData({
        location: app.globalData.selected_location.title === undefined ? "" : app.globalData.selected_location.title
      })
    }
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
  showLocation: function() {
    wx.navigateTo({
      url: '/pages/location/index?source=address',
    })
  },
  showArea: function () {
    this.setData({
      showAreaSheet: true
    })
  },
  hideArea: function () {
    this.setData({
      showAreaSheet: false
    })
  },
  selectedArea: function (e) {
    let _city = ""
    for (let i = 0; i < e.detail.values.length; i++) {
      _city += e.detail.values[i].name + " "
    }
    this.setData({
      city: _city,
      selected_area: e.detail.values[e.detail.values.length - 1].code,
      showAreaSheet: false
    })
  },
  showType: function () {
    this.setData({
      showTypeSheet: true
    })
  },
  hideType: function () {
    this.setData({
      showTypeSheet: false
    })
  },
  selectedType: function (event) {
    const { picker, value, index } = event.detail;
    this.setData({
      address_type: value,
      showTypeSheet: false
    })
  },
  saveAddr: function() {
    if (this.data.real_name === undefined || this.data.real_name === '' || this.data.real_name === ' ') {
      Dialog.alert({
        title: '轻果提醒',
        message: '请正确填写收货人姓名'
      }).then(() => {
        // on close
      });
      return false
    }
    else if (this.data.phone === undefined || this.data.phone === '' || this.data.phone === ' ') {
      Dialog.alert({
        title: '轻果提醒',
        message: '请正确填写收货人联系电话'
      }).then(() => {
        // on close
      });
      return false
    }
    else if (this.data.location === undefined || this.data.location === '' || this.data.location === ' ') {
      Dialog.alert({
        title: '轻果提醒',
        message: '请正确选择收货地址'
      }).then(() => {
        // on close
      });
      return false
    }
    else if (this.data.address === undefined || this.data.address === '' || this.data.address === ' ') {
      Dialog.alert({
        title: '轻果提醒',
        message: '请正确填写详细地址 楼号门牌'
      }).then(() => {
        // on close
      });
      return false
    }
    else if (this.data.address_type === undefined || this.data.address_type === '' || this.data.address_type === ' ') {
      Dialog.alert({
        title: '轻果提醒',
        message: '请选择地址类型'
      }).then(() => {
        // on close
      });
      return false
    }
    if (!(/^1[1234567890]\d{9}$/.test(this.data.phone))) {
      Dialog.alert({
        title: '轻果提醒',
        message: '手机号格式错误'
      }).then(() => {
        // on close
      });
      return false
    }
    wx.navigateBack({})
  },
  setRealName: function (e) {
    this.setData({
      real_name: e.detail
    })
  },
  setPhone: function (e) {
    this.setData({
      phone: e.detail
    })
  },
  setLocation: function (e) {
    this.setData({
      location: e.detail
    })
  },
  setAddress: function (e) {
    this.setData({
      address: e.detail
    })
  },
  setAddressType: function (e) {
    this.setData({
      address_type: e.detail
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  }
})