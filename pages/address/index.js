// pages/address/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import api from '../../api/api';
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
    modify: false,
    id: '',
    areaList: {},
    columns: ['住宅', '公司', '学校', '其他'],
    real_name: "",
    phone: "",
    city: "",
    location: "",
    location_info: {},
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
      selected_area: app.globalData.location.ad_info.adcode,
      modify: options.type === '1',
      id: undefined === options.id ? "" : options.id
      // areaList: AreaList
    })
    if (this.data.modify) {
      api.getAddr(this.data.id).then(res => {
        this.setData({
          real_name: res.receive_name,
          phone: res.phone,
          city: res.city,
          location: res.title,
          location_info: {
            adcode: res.city_code,
            addr: res.address,
            city: res.city,
            district: res.district,
            latitude: res.lat,
            longitude: res.lng,
            title: res.title
          },
          address: res.location,
          address_type: res.address_type
        })
      })
    }
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
      this.data.location_info = app.globalData.selected_location
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
  // selectedArea: function (e) {
  //   let _city = ""
  //   for (let i = 0; i < e.detail.values.length; i++) {
  //     _city += e.detail.values[i].name + " "
  //   }
  //   this.setData({
  //     city: _city,
  //     selected_area: e.detail.values[e.detail.values.length - 1].code,
  //     showAreaSheet: false
  //   })
  // },
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
    if (this.data.modify) {
      api.modifyAddr(
        this.data.id,
        this.data.real_name,
        this.data.phone,
        this.data.address_type,
        this.data.location_info.adcode,
        this.data.location_info.city,
        this.data.location_info.addr,
        this.data.address,
        this.data.location_info.district,
        this.data.location_info.latitude,
        this.data.location_info.longitude,
        this.data.location_info.title).then(res => {
          wx.navigateBack({})
        })
    } else {
      api.addAddr(
        this.data.real_name,
        this.data.phone,
        this.data.address_type,
        this.data.location_info.adcode,
        this.data.location_info.city,
        this.data.location_info.addr,
        this.data.address,
        this.data.location_info.district,
        this.data.location_info.latitude,
        this.data.location_info.longitude,
        this.data.location_info.title).then(res => {
          wx.navigateBack({})
        }).catch(err => {
          Dialog.alert({
            title: '轻果提醒',
            message: err
          }).then(() => {
            // on close
          });
        })
    }
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
    if (e.detail.encryptedData === undefined) {
      wx.showToast({
        title: '未授权无法自动获取，请手动输入',
        icon: 'none'
      })
      return false
    }
    api.post(app.globalApi.get_phone, { data: { iv: e.detail.iv, data: e.detail.encryptedData } }).then(res => { this.setData({ phone: res }) }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    })
  },
  delAddr: function() {
    Dialog.confirm({
      title: '提示',
      message: '您确定要删除该收货地址吗'
    }).then(() => {
      api.delAddr(this.data.id).then(res => {
        wx.navigateBack({})
      })
    }).catch(() => { });
  }
})