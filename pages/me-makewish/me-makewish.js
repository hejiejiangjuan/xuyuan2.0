// pages/me-makewish/me-makewish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        text: "全部"
      },
      {
        id: 1,
        text: "已实现"
      }
    ],
    mySrc: "https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg",
    TabCur: 0,
    scrollLeft: 0,
    openstatus:true,
    giveStatus:true,
    fileServer: app.globalData.fileServer,
    curPage: 1,
    pageSize: 10,
    myWishDetailList: [],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false
  },
  //导航条
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id ,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      curPage : 1,
      myWishDetailList : []
    })
    this.getMyWishDetailList();
  },
  //点击打开全文
  openBtn(e) {
    const index = e.currentTarget.dataset.index;
    var myWish = this.data.myWishDetailList;
    myWish[index].flag = !myWish[index].flag;
    this.setData({
      myWishDetailList: myWish
    })
  },
  //点赞
  giveLike() {
    this.setData({
      giveStatus: !this.data.giveStatus
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyWishDetailList();
  },
  getMyWishDetailList() {
    
    //获取list
    var that = this;
    if (that.data.curPage == 1) {
      this.data.myWishDetailList = [];
    }
    wx.request({
      url: app.globalData.base_url + 'personal/getMyWishDetailList',
      method: 'GET',
      data: {
        curPage: this.data.curPage,
        pageSize: this.data.pageSize,
        type: this.data.TabCur + 2
      },
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas != null) {
            for (var i = 0; i < res.data.datas.length; i++) {
              res.data.datas[i].flag = true;
              for (var j = 0; j < res.data.datas[i].wishListStr.length; j++) {
                if (!res.data.datas[i].wishListStr[j].icon) {
                  res.data.datas[i].wishListStr[j].icon = 'default/default.png';
                }
              }
            }
            const ret = that.data.myWishDetailList.concat(res.data.datas);
            that.setData({
              myWishDetailList: ret,
              curPage: that.data.curPage + 1
            })
            that.setData({
              isRefreshing: false,
              isLoadingMoreData: false
            })
            if (res.data.datas.length < that.data.pageSize) {
              that.setData({
                hasMoreData: false
              })
            }
          }
          
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
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
    this.data.curPage = 1;
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getMyWishDetailList()//数据请求
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMoreData: true
    })
    this.getMyWishDetailList()//数据请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})