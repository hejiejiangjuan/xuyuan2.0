const app = getApp();
// pages/me-cooperation/me-cooperation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openstatus: true,
    joinHand: [], //商务合作列表
  },

  //获取商务合作列表
  getAllJoinHand() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getAllJoinHand',
      method: 'get',
      data: {},
      header: app.globalData.header,
      success(res) {
        for (var i = 0; i < res.data.datas.length; i++) {
          res.data.datas[i].openstatus = true;
        }
        that.setData({
          joinHand: res.data.datas
        })
      }
    })
  },

  //点击打开全文
  openBtn(e) {
    var index = e.currentTarget.dataset.index;
    var open = this.data.joinHand;
    open[index].openstatus = !open[index].openstatus;
    this.setData({
      joinHand: open

    })
  },
  //关闭
  closeBtn(e){
    var index = e.currentTarget.dataset.index;
    var open = this.data.joinHand;
    open[index].openstatus = !open[index].openstatus;
    this.setData({
      joinHand: open

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAllJoinHand();
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