// pages/address/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    title: '添加收货地址',
    showAreaSheet: false,
    showTypeSheet: false,
    typeList: [
      {
        name: '住宅'
      },
      {
        name: '公司'
      },
      {
        name: '学校'
      },
      {
        name: '其他'
      }
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
      url: '/pages/location/index?from=address',
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
  selectedArea: function () {
    this.setData({
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
  selectedType: function (e) {
    console.log(e)
    this.setData({
      showTypeSheet: false
    })
  }
})