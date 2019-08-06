const app = getApp();
// pages/sendCard/sendCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true, //是否显示领取按钮
    recordId: '', //领取心愿卡ID
    wishcardSendInfo: {}, //领取心愿卡信息
    showModal: false, //是否显示授权登录
  },
  //立即领取心愿卡
  getWishcardFromSend() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/getWishcardFromSend',
      method: 'post',
      data: {
        recordId: that.data.recordId
      },
      header: app.globalData.header,
      success(res) {
        if(res.data.code==200){
          that.setData({
            wishcardSendInfo: res.data.datas
          })
          wx.showToast({
            title: '领取成功',
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
        that.getWishcardSendInfo();
      }
    })
  },
  //获取赠送心愿卡信息
  getWishcardSendInfo() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/getWishcardSendInfo',
      method: 'post',
      data: {
        recordId: that.data.recordId
      },
      header: app.globalData.header,
      success(res) {
        that.setData({
          wishcardSendInfo: res.data.datas
        })
      }
    })
  },
  //跳转首页
  firstPage() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //返回首页
  backPage() {
    wx.switchTab({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      recordId: options.recordId
    })
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
    var that = this;
    this.setData({
      status: true, //是否显示领取按钮
      wishcardSendInfo: {}, //领取心愿卡信息
    })
    app.scrollToTop();
    if (!app.globalData.userInfo || !app.globalData.header) { //未登陆
      app.myLogin().then(function(res) {
        if (!('unauth' == res)) { //已授权
          that.getWishcardSendInfo()
        }
      })
    } else {
      that.getWishcardSendInfo()
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  manaGement() { //允许授权
    var that = this;
    that.onShow()
  }
})