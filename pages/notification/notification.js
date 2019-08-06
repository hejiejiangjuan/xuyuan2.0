// pages/notification/notification.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    pageSize: 10,
    list: [],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessageListByType();
  },
  getMessageListByType() {
    var that = this;
    if (that.data.currentPage == 1) {
      that.data.list = [];
    }
    var param = {
      type: 2,
      currentPage: that.data.currentPage,
      pageSize: that.data.pageSize
    };
    wx.request({
      url: app.globalData.base_url + 'wx/wish/message/getMessageListByType',
      method: 'GET',
      data: {
        param: JSON.stringify(param)
      },
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas != null) {
            var datas = res.data.datas;
            const ret = that.data.list.concat(datas);
            that.setData({
              list: ret,
              currentPage: that.data.currentPage + 1
            })
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
  toDatlie (e) {
    const index = e.currentTarget.dataset.index;
    const obj = this.data.list[index];
    if (obj.wishId) {
      wx.navigateTo({
        url: '../me-makewish/me-makewish',
      })
    } else {
      wx.navigateTo({
        url: '../evenDetails/evenDetails?id=' + obj.activityId,
      })
    }
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
    this.data.currentPage = 1;
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.getMessageListByType()//数据请求
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
    this.getMessageListByType()//数据请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})