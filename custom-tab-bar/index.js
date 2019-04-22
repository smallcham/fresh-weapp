Component({

  /**
   * Page initial data
   */
  data: {
    selected: 0,
    color: "#95a5a6",
    selectedColor: "#18BC9C",
    cartCount: 0,
    animationData: {},
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/image/home.png",
      selectedIconPath: "/image/home_fill.png",
      text: "首页"
    }, {
        pagePath: "/pages/cata/index",
        iconPath: "/image/cata.png",
        selectedIconPath: "/image/cata_fill.png",
        text: "分类"
      }, {
        pagePath: "/pages/spread/index",
        iconPath: "/image/money.png",
        selectedIconPath: "/image/money_fill.png",
        text: "积分+"
      }, {
        pagePath: "/pages/cart/index",
        iconPath: "/image/cart.png",
        selectedIconPath: "/image/cart_fill.png",
        animation: true,
        info: true,
        text: "购物车"
      }, {
        pagePath: "/pages/mine/index",
        iconPath: "/image/mine.png",
        selectedIconPath: "/image/mine_fill.png",
        text: "我的"
      }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    },
    onChange: function (event) {
      if (event.detail === 0) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      else if (event.detail === 1) {
        wx.switchTab({
          url: '/pages/cata/index',
        })
      }
      else if (event.detail === 2) {
        wx.switchTab({
          url: '/pages/spread/index',
        })
      }
      else if (event.detail === 3) {
        wx.switchTab({
          url: '/pages/cart/index',
        })
      }
      else if (event.detail === 4) {
        wx.switchTab({
          url: '/pages/mine/index',
        })
      } else {

      }
      this.setData({
        active: event.detail
      })
    }
  }
})