const app = getApp();
// pages/me-feedback/me-feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkData: [],//默认反馈类型
    chekindex: 0,//选择的类型下标
    imgList: [],//上图图片数组
    feedbackType: {},//选择的类型对象
    content: "",//反馈内容
    imgUrlList:[],//图片地址数组
  },
  //选择按钮
  checke(e){
    this.setData({
      chekindex: e.currentTarget.dataset.index,
       feedbackType: this.data.checkData[e.currentTarget.dataset.index]
    })
  },




  //从相册选择照片
  ChooseImage() {
    var that=this;
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.fileServer + 'fileUpload', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            const dataObj = JSON.parse(data);
            that.data.imgUrlList.push(dataObj.datas)
            that.data.imgList.push(app.globalData.fileServer + dataObj.datas)
            if (dataObj.code == 200) {
              that.setData({
                imgUrlList: that.data.imgUrlList,
                imgList: that.data.imgList
              })
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    });
  },
  //删除照片
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  //获取反馈内容
  getContent(e){
    this.setData({
      content:e.detail.value
    })
    
  },
  //获取问题反馈类型
  getFeedbackType() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/feedback/getFeedbackType',
      method: 'POST',
      data: {},
      header: app.globalData.header,
      success(res) {
        that.setData({
          checkData: res.data.datas
        })
      }
    })
  },
  //提交问题反馈
  addFeedback() {
    var that = this;
    if (that.data.content == null || that.data.content==""){
      wx.showToast({
        title: '请输入反馈内容',
        icon:'none'
      })
      return;
    }
    wx.request({
      url: app.globalData.base_url + 'wx/wish/feedback/addFeedback',
      method: 'POST',
      data: {
        typeId: encodeURI(that.data.feedbackType.id),
        content: encodeURI(that.data.content),
        picList: encodeURI(JSON.stringify(that.data.imgUrlList))
      },
      header: app.globalData.header,
      success(res) {
        wx.showToast({
          title: '反馈成功',
        })
        that.setData({
          content: '',
          imgList: [],
          imgUrlList:[],
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFeedbackType();
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