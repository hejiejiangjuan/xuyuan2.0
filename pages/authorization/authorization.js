// pages/authorization/authorization.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authList:[]
  },
  showModal(e) {
    wx.setClipboardData({
      data: '公众号授权',
    })
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //跳转客服中心
  toCustomer(){
    this.setData({
      modalName: null
    })
  },
  //返回上一页
  backePage(e){
    var item = e.currentTarget.dataset.item
    var pages=getCurrentPages()
    var prevPage=pages[pages.length-2]
    prevPage.setData({
      public_auth_id: item.id ,
      publicName: item.nickName
    })
    wx.navigateBack({
      delta:1
    })
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
    this.getAuthList();
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

  },

  //获取已授权列表
  getAuthList(){
    var that = this;
    //获取静态统计数据
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wxOpen/getAuthPublic',
      method: 'POST',
      header: app.globalData.header,
      success(res) {
        that.setData({
          authList:res.data.datas
        })
      }
    });
  }
})