const app = getApp();
// pages/me-contact/me-contact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kefuInfo: [], //联系我们数据
    qrcode: '', //客服二维码
    phone: '', //手机号码
    copyContent: '', //客服微信
  },
  //长按识别二维码
  previewImage: function(e) {
    var that=this
    var current = that.data.qrcode.titleValue;debugger
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //获取联系我们
  getAboutUs() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'personal/getConnection',
      method: 'POST',
      header: app.globalData.header,
      data: {},
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas.kefuInfo != null) {
            for (var i = 0; i < res.data.datas.kefuInfo.length; i++) {
              if (res.data.datas.kefuInfo[i].phoneStatus == 1) {
                that.setData({
                  phone: res.data.datas.kefuInfo[i].titleValue
                })
              }
            }
            that.setData({
              kefuInfo: res.data.datas.kefuInfo
            })
          }
          if (res.data.datas.qrcode != null){
            res.data.datas.qrcode.titleValue = app.globalData.fileServer + '/' + res.data.datas.qrcode.titleValue;
            that.setData({
              qrcode: res.data.datas.qrcode
            })
          }
        }
      }
    })
  },
  //拨打电话
  tel() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },
  //复制weixin
  copyData() {
    wx.setClipboardData({
      data: this.data.copyContent,
      success(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAboutUs();
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

  }
})