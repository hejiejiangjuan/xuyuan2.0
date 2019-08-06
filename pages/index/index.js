//index.js
//获取应用实例
//index.js
const app = getApp();
var sliderWidth = 96;

Page({
  data: {
    autoplay: true,//跑马灯值
    interval: 2000,//跑马灯值
    duration: 1000,//跑马灯值
    fistDataCount:'',//许愿总数
    fistData:[],//跑马灯数据
    reSubmit: false, //防重复提交
    fileServer: app.globalData.fileServer,
    showModal: false, //是否显示授权窗
    isLogin: false,
    curPage: 1,
    pageSize: 10,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    list: [],
    num: '',
    zan: false,
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false,
    tabs: [{
        id: 1,
        text: "热门"
      },
      {
        id: 2,
        text: "最新"
      }
    ],
    TabCur: 0,
    scrollLeft: 0,
    mySrc: "https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg",
    openstatus: true, //点击展开全部的状态
    actvie:null
   
  },
  // 我要上首
  thefirst() {
      wx.navigateTo({
        url: '../theFirst/theFirst',
      })
  },
  //隐藏模态框
  hideModal(){
    this.setData({
      modalName: null
    })
  },
  
  //点击打开全文
  openBtn(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      actvie: id,
    })
  },
  //点击关闭全文
  closBtn(){
    this.setData({
      actvie:null,
    })
  },
  //获取弹幕数据
  getWishRealization(){
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wishDetail/getWishRealization',
      method: 'POST',
      data: {},
      header: app.globalData.header,
      success(res) {
        var data = res.data.datas.list;
        that.setData({
          fistData: data,
          fistDataCount: res.data.datas.count
        })
      }
    })
  },
 
  //立即参加活动
  activeJion() {
    wx.navigateTo({
      url: '../activeJion/activeJion',
    })
  },
  //跳转到许愿
  wishPage() {
    wx.switchTab({
      url: '../wish/wish'
    })
  },

  onPullDownRefresh: function() {
    this.data.curPage = 1;
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getWishList() //数据请求
  },

  //触底分页
  onReachBottom: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMoreData: true
    })
    this.getWishList() //数据请求
  },

  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  //页面数据渲染
 

  onShow: function() {
    var that = this;
    this.setData({
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      TabCur:0,
      list: [],
      num: '',
      zan: false,
      hasMoreData: true,
      isRefreshing: false,
      isLoadingMoreData: false
    })
    that.data.curPage = 1;
    app.scrollToTop();
    if (!app.globalData.userInfo || !app.globalData.header) { //未登陆
      app.myLogin().then(function(res) {
        if (!('unauth' == res)) { //已授权
          that.getWishList();
        }
      })
    } else {
      that.getWishList();
    }
    
    this.getWishRealization();
  },



  //页面数据渲染
  onReady: function() {
   
  },
  //获取愿望列表
  getWishList() {
    var that = this;
    var p = new Promise(function(resolve, reject) {
      if (that.data.reSubmit) {
        return;
      }

      that.data.reSubmit = true;
      if (that.data.curPage == 1) {
        that.data.list = [];
      }

      var detailUrl = "getWishDetailList";
      if (that.data.activeIndex == '1') {
        detailUrl = "getWishDetailCreateList";
      }

      wx.request({
        url: app.globalData.base_url + 'wishDetail/' + detailUrl,
        method: 'get',
        data: {
          curPage: that.data.curPage,
          pageSize: that.data.pageSize
        },
        header: app.globalData.header,
        success(res) {
          if (res.data.datas) {
            for (var i = 0; i < res.data.datas.length; i++) {
              res.data.datas[i].flag = false;
              if (res.data.datas[i].wishListStr) {
                for (var j = 0; j < res.data.datas[i].wishListStr.length; j++) {
                  if (!res.data.datas[i].wishListStr[j].icon) {
                    res.data.datas[i].wishListStr[j].icon = 'default/default.png';
                  }
                }
              }
            }
            that.setData({
              list: that.data.list.concat(res.data.datas),
            })
          }
          that.data.curPage = that.data.curPage + 1;
          that.setData({
            isRefreshing: false,
            isLoadingMoreData: false
          })
          if (!res.data.datas || res.data.datas.length < that.data.pageSize) {
            that.setData({
              hasMoreData: false
            })
          } else {
            that.setData({
              hasMoreData: true
            })
          }
          that.data.reSubmit = false;
        }
      })
    })
    return p;
  },
 



  //点赞支持
  dianZanzhichi(e) {
    let thit = this;
    var idx = e.currentTarget.dataset.idx, // 获取当前下标
      key = "list[" + idx + "].isSurport",
      isSurport = thit.data.list[idx].isSurport,
      numKey = "list[" + idx + "].supportNum",
      id = thit.data.list[idx].id,
      supportNum = thit.data.list[idx].supportNum;
    var toIsSurport = thit.data.list[idx].isSurport == 0 ? '1' : '0';
    this.setData({
      [key]: toIsSurport
    });
    if (toIsSurport == 1) {
      supportNum += 1
      this.setData({
        [numKey]: supportNum
      })
    } else {
      supportNum -= 1
      this.setData({
        [numKey]: supportNum
      })
    }
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wishDetail/changeSupport',
      method: 'GET',
      data: {
        detailId: id,
        toSupport: toIsSurport
      },
      header: app.globalData.header,
      success(res) {}
    })
  },
  // //导航条
  // tabSelect(e) {
  //   this.setData({
  //     TabCur: e.currentTarget.dataset.id,
  //     scrollLeft: (e.currentTarget.dataset.id - 1) * 60
  //   })
  // },

  tabSelect: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.dataset.id,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    });
    this.data.curPage = 1;
    this.getWishList();
  },
  manaGement() { //允许授权
    var that = this;
    that.onShow()
  }
})