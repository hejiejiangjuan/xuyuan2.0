const app = getApp();
// pages/me-feedback/me-feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkData: [], //默认反馈类型
    chekindex: 0, //选择的类型下标
    feedbackType: {}, //选择的类型对象
    content: "", //反馈内容
    objectId: '', //举报对象Id
  },
  //选择按钮
  checke(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      chekindex: e.currentTarget.dataset.index,
      feedbackType: this.data.checkData[e.currentTarget.dataset.index]
    })
  },

  //获取举报内容
  getContent(e) {
    this.setData({
      content: e.detail.value
    })

  },
  //获取举报类型
  getFeedbackType() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'rePort/getIllegalrTypeDMList',
      method: 'POST',
      data: {},
      header: app.globalData.header,
      success(res) {
        that.setData({
          checkData: res.data.datas,
          feedbackType: res.data.datas[0]
        })
      }
    })
  },
  //提交举报
  addRePort() {
    var that = this;
    if (that.data.content == null || that.data.content == "") {
      wx.showToast({
        title: '请输入举报内容',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: app.globalData.base_url + 'rePort/addRePort',
      method: 'POST',
      data: {
        typeId: encodeURI(that.data.feedbackType.id),
        content: encodeURI(that.data.content),
        objectId: encodeURI(that.data.objectId),
      },
      header: app.globalData.header,
      success(res) {
        wx.showToast({
          title: '举报成功',
        })
        that.setData({
          content: '',
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getFeedbackType();
    this.setData({
      objectId: options.objectId
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