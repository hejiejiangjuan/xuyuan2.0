const app = getApp();
// pages/me-aboutUs/me-aboutUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usInfo:{},//关于我们信息
    version:{},//版本号
  },
  //获取关于我们
  getAboutUs(){
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'personal/getAboutUs',
      method: 'POST',
      header: app.globalData.header,
      data: {},
      success(res) {
        if(res.data.code==200){
          if (res.data.datas.usInfo != null){
            that.setData({
              usInfo: res.data.datas.usInfo
            })
          }
          if (res.data.datas.version != null){
            that.setData({
              version: res.data.datas.version
            })
          }
        }
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAboutUs();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})