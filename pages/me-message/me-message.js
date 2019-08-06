// pages/me-message/me-message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prize_msg: '', //中奖通知
    wish_msg: '',  //心愿点亮
    system_msg: '' //系统消息
  },
//跳转页面到系统消息
  systemMessage(){
    wx.navigateTo({
      url: '../systemMessage/systemMessage',
    })
  },
  //跳转到中将通知
  notification(){
    wx.navigateTo({
      url: '../notification/notification',
    })
  },
  //点亮心愿页
  wishLight(){
    wx.navigateTo({
      url: '../wishLight/wishLight',
    })
  },
  //获取未读消息条数
  getMessageCount () {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/message/getMessageCount',
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas != null) {
            var datas = res.data.datas;
            that.setData({
              prize_msg: datas.prize_msg, 
              wish_msg: datas.wish_msg,  
              system_msg: datas.system_msg 
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getMessageCount()
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
    this.getMessageCount();
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