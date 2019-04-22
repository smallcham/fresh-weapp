// pages/list/index.js
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    title: "分类",
    loading: app.globalData.loading,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: app.globalData.TabCur,
    VerticalNavTop: 0,
    last_top: 0,
    now_page: 1,
    goodsCata: app.globalData.goodsCata
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
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
      color: app.globalData.color
    })
    this.getTabBar().setData({
      selected: 1
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
    this.setData({
      location: app.globalData.location,
      selected_location: app.globalData.selected_location,
      TabCur: app.globalData.TabCur
    })
    this.getTabBar().setData({
      selected: 1
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
  }
})