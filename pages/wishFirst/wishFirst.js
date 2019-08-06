// pages/wishFirst/wishFirst.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mySrc: "https://ossweb-img.qq.com/images/lol/web201310/skin/big25002.jpg",
    openstatus: true, //点击展开全部的状态
    giveStatus: true, //点赞的状态
    checkboxStatus: false,
    fileServer: app.globalData.fileServer,
    curPage: 1,
    pageSize: 10,
    myWishDetailList: [],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false,
    id : ''
  },
  //点击选择需要上首的活动
  checkbox(e) {
    const index = e.currentTarget.dataset.index;
    var myWish = this.data.myWishDetailList; 
    for (var i = 0; i < myWish.length; i++) {
      myWish[i].checked = false;
    }
    myWish[index].checked = !myWish[index].checked;
    var id = ''
    if (myWish[index].checked) {
      id = myWish[index].id;
    } else {
      id = '';
    }
    this.setData({
      myWishDetailList: myWish,
      id: id
    })

  },
  //跳转到金额选择
  nexttap(){
    var id = this.data.id;
    if (id) {
      wx.navigateTo({
        url: '../checkprice/checkprice?id='+id,
      })
    } else {
      wx.showToast({
        title: '您还未选择心愿',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //点击打开全文
  openBtn(e) {
    const index = e.currentTarget.dataset.index;
    var myWish = this.data.myWishDetailList;
    myWish[index].flag = !myWish[index].flag ;
    this.setData({
      myWishDetailList: myWish
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
        type: 1
      },
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas != null) {
            for (var i = 0; i < res.data.datas.length; i++) {
              res.data.datas[i].flag = true;
              res.data.datas[i].checked = false;
              for (var j = 0; j < res.data.datas[i].wishListStr.length; j++) {
                if (!res.data.datas[i].wishListStr[j].icon) {
                  res.data.datas[i].wishListStr[j].icon = 'default/default.png';
                }
              }
            }
            const ret = that.data.myWishDetailList.concat(res.data.datas);
            console.log(ret)
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
  onShareAppMessage: function() {

  }
})