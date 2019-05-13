// pages/search/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: true,
    border: false,
    hotWord: [
      { text: "菠菜" },
      { text: "韭菜" },
      { text: "鲜奶" },
      { text: "草莓" },
      { text: "鲜肉" },
      { text: "五花" },
      { text: "坚果" },
      { text: "抽纸" },
      { text: "饼干" },
      { text: "饮料" }
    ],
    history: [
      { text: "设计师。" },
      { text: "uahahabbaa" },
      { text: "嗷嗷叫啊哈哈" },
      { text: "猕猴桃" },
      { text: "面包" },
      { text: "龙眼" },
      { text: "纸包鸡" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      color: app.globalData.color
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '轻果鲜生',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) { }
    }
  }
})