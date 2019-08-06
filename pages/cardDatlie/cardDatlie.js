const app = getApp();
// pages/cardDatlie/cardDatlie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reSubmit: false, //防重复提交
    wishcardRecord: [], //心愿卡明细
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false,
    activeIndex: 0,
    curPage: 1,
    pageSize: 10,
    useWish:'0',//心愿卡使用数量
    obtainWish:'0',//心愿卡获取数量
  },
  //获取心愿卡总数
  getMyWishCount(){
    var that=this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/getMyWishCount',
      method: 'POST',
      header: app.globalData.header,
      data: {},
      success(res) {
        var wishDate=res.data.datas;
        for(var i=0;i<wishDate.length;i++){
          if (wishDate[i].change_type==1){
            that.setData({
              obtainWish: wishDate[i].count,
            })
          } else if (wishDate[i].change_type == 2){
            that.setData({
              useWish: wishDate[i].count,
            })
          }
        }
        
      }
    })
  },
  //获取心愿卡明细
  getMyWishcardRecord() {
    var that = this;
    var p = new Promise(function(resolve, reject) {
      if (that.data.reSubmit) {
        return;
      }

      that.data.reSubmit = true;
      if (that.data.curPage == 1) {
        that.data.list = [];
      }
      wx.request({
        url: app.globalData.base_url + 'wx/wish/wishcard/getMyWishcardRecord',
        method: 'POST',
        header: app.globalData.header,
        data: {
          pageNum: that.data.curPage,
          pageSize: that.data.pageSize
        },
        success(res) {
          that.setData({
            wishcardRecord:that.data.wishcardRecord.concat(res.data.datas),
          })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.getMyWishcardRecord();
    this.getMyWishCount();
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
  onPullDownRefresh: function() {
    this.data.curPage = 1;
    this.setData({
      wishcardRecord:[]
    });
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getMyWishcardRecord();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMoreData: true
    })
    this.getMyWishcardRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
  }
})