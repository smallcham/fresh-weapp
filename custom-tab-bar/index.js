Component({

  /**
   * Page initial data
   */
  data: {
    selected: 0,
    show: true,
    color: "#95a5a6",
    selectedColor: "#18BC9C",
    cartCount: 0,
    animationData: {},
  //   list: [{
  //     pagePath: "/pages/index/index",
  //     iconPath: "/image/home.png",
  //     selectedIconPath: "/image/home_fill.png",
  //     text: "首页"
  //   }, {
  //       pagePath: "/pages/cata/index",
  //       iconPath: "/image/cata.png",
  //       selectedIconPath: "/image/cata_fill.png",
  //       text: "分类"
  //     }, {
  //       pagePath: "/pages/spread/index",
  //       iconPath: "/image/money.png",
  //       selectedIconPath: "/image/money_fill.png",
  //       text: "积分+"
  //     }, {
  //       pagePath: "/pages/cart/index",
  //       iconPath: "/image/cart.png",
  //       selectedIconPath: "/image/cart_fill.png",
  //       animation: true,
  //       info: true,
  //       text: "购物车"
  //     }, {
  //       pagePath: "/pages/mine/index",
  //       iconPath: "/image/mine.png",
  //       selectedIconPath: "/image/mine_fill.png",
  //       text: "我的"
  //     }]
  // },
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "http://fs.llfresh.cn/cce6d3a38249b3a7adad4640d59a8199",
      selectedIconPath: "http://fs.llfresh.cn/1f0ded876cd976acd7ba292f17ad5335",
      text: "首页"
    }, {
      pagePath: "/pages/cata/index",
        iconPath: "http://fs.llfresh.cn/e86891fb29335430be90dae2f9af554e",
        selectedIconPath: "http://fs.llfresh.cn/6d368237f54e3e4d996eaa205b60ecd9",
      text: "分类"
    }, {
      pagePath: "/pages/spread/index",
        iconPath: "http://fs.llfresh.cn/afda385ac434258538f223c0f05c0568",
        selectedIconPath: "http://fs.llfresh.cn/422085822d0d320a344c14d48b4b111a",
      text: "积分+"
    }, {
      pagePath: "/pages/cart/index",
        iconPath: "http://fs.llfresh.cn/7743f96ecb8509bb34fa55152b49a29a",
        selectedIconPath: "http://fs.llfresh.cn/10baccd3e9470debcfa9c477f5775563",
      animation: true,
      info: true,
      text: "购物车"
    }, {
      pagePath: "/pages/mine/index",
        iconPath: "http://fs.llfresh.cn/c92e26d06830ac01336d2ec02a88ba79",
        selectedIconPath: "http://fs.llfresh.cn/568d4af729f1214756a0a8087e2121b8",
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
    plusCartCount: function () {
      this.setCartCount(this.data.cartCount + 1)
    },
    reduceCartCount: function () {
      this.setCartCount(this.data.cartCount - 1)
    },
    setCartCount: function (count) {
      this.setData({ cartCount: count })
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