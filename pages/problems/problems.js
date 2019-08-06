const app = getApp();
// pages/problems/problems.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openstatus:true,
    commonQuestion:[],//常见问题列表
  },
  //获取常见问题列表
  getCommonQuestion(){
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getCommonQuestion',
      method: 'get',
      data: {},
      header: app.globalData.header,
      success(res) {
        for(var i=0;i<res.data.datas.length;i++){
          res.data.datas[i].openstatus=true;
        }
        that.setData({
          commonQuestion:res.data.datas
        })
      }
    })
  },
  //点击打开全文
  openBtn(e) {
    var index = e.currentTarget.dataset.index;
    var common = this.data.commonQuestion;
    common[index].openstatus = !common[index].openstatus;
    this.setData({
      commonQuestion: common

    })
  },
  //关闭
  closeBtn(e) {
    var index = e.currentTarget.dataset.index;
    var common = this.data.commonQuestion;
    common[index].openstatus = !common[index].openstatus;
    this.setData({
      commonQuestion: common

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommonQuestion();
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