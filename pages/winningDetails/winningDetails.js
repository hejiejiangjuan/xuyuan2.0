var app = getApp()
// pages/winningDetails/winningDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, //收获地址信息
    userInfoAddress: '', //选择返回显示内容
    prizeId:'',//中奖记录Id
    remark:'',//备注信息
    activtId:'',//活动Id
    addressStatus:true,//是否已授权获取收货地址
  },
  //获取文本框值
  textareaAInput(e){
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      prizeId: options.prizeId,
      activtId: options.activityId
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

  },

  addressType() {
    var that = this;
    wx.openSetting({
      success(res) {
        that.setData({
          addressStatus: true
        })
        wx.chooseAddress({
          success(res) {
            that.setData({
              addressStatus: true
            })
          }
        })
      }
    })
  },
  //调用微信收获地址接口
  saveAddress() {
    var that = this
    var userAddress = {}
    wx.chooseAddress({
      success(res) {
        userAddress = {
          userName: res.userName,
          postalCode: res.postalCode,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          nationalCode: res.nationalCode,
          telNumber: res.telNumber
        }
        that.setData({
          address: userAddress,
          userInfoAddress: res.userName + ',' + res.telNumber + ',' + res.provinceName + res.cityName + res.countyName + res.detailInfo
        })
      },
      fail(res) {
        that.setData({
          addressStatus: false
        })
      }
    })
  },
  //保存收获地址
  setAddress(){
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/sendAddress',
      header: app.globalData.header,
      method: 'post',
      data: {
        address: encodeURI(JSON.stringify(that.data.address)), 
          prizeId: encodeURI(that.data.prizeId),
            remark: encodeURI(that.data.remark)
      },
      success(res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../evenDetails/evenDetails?id='+that.data.activtId,
          })
        } 
      }
    })
  },
})