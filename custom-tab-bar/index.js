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

  //  {
  //   pagePath: "/pages/spread/index",
  //   iconPath: "http://fs.llfresh.cn/afda385ac434258538f223c0f05c0568",
  //   selectedIconPath: "http://fs.llfresh.cn/422085822d0d320a344c14d48b4b111a",
  //   text: "优惠+"
  // }, 
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "http://fs.llfresh.cn/cce6d3a38249b3a7adad4640d59a8199",
      selectedIconPath: "http://fs.llfresh.cn/1f0ded876cd976acd7ba292f17ad5335",
      text: "首页"
    }, {
        pagePath: "/pages/cata/index",
        iconPath: "http://fs.llfresh.cn/f37aba961ee75aa6af5273cd1b19aee9",
        selectedIconPath: "http://fs.llfresh.cn/4db3aae695001be1e249149e0a6dd59b",
        text: "分类"
      }, {
        pagePath: "/pages/team/index",
        iconPath: "http://fs.llfresh.cn/d1540b0cf952616345c4634ab457e557",
        selectedIconPath: "http://fs.llfresh.cn/581bb8b0a9922e057215b184275779aa",
        text: "拼团"
      },{
      pagePath: "/pages/cart/index",
        iconPath: "http://fs.llfresh.cn/6adfa75af880821b5f5b2ae63bdc623f",
        selectedIconPath: "http://fs.llfresh.cn/5bff891ff1316469232f5532adc608c4",
        animation: true,
        info: true,
        text: "购物车"
    }, {
      pagePath: "/pages/mine/index",
        iconPath: "http://fs.llfresh.cn/f30d5da840d4d2376a0b5912da2e3c8f",
        selectedIconPath: "http://fs.llfresh.cn/de33df28639108e2e424eabc808a9788",
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
          url: '/pages/team/index',
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