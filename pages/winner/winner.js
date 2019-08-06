var app = getApp()
// pages/winner/winner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress: [], //中奖用户收获地址
    activityId: '', //活动Id
    downUrl: '', //下载地址
  },
  //获取中奖用户收货地址信息
  getUserAddress() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getUserAddress',
      header: app.globalData.header,
      method: 'post',
      data: {
        activityId: encodeURI(that.data.activityId),
      },
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas != null) {
            that.setData({
              userAddress: res.data.datas
            })
          }
        }
      }
    })
  },
  //一键复制全部
  copyAllAddress() {
    var that = this
    var str = that.data.userAddress
    var address = ''
    for (var i = 0; i < str.length; i++) {
      address += str[i].username + str[i].telnumber + str[i].provincename + str[i].cityName + str[i].countyname + str[i].detailinfo + str[i].remark + ','
    }
    wx.setClipboardData({
      data: address,
      success(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  hideModal() {
    this.setData({
      modalName: null
    })
  },
  //复制下载地址
  copyPublicCommand() {
    var that = this
    that.setData({
      modalName: null
    })
    wx.setClipboardData({
      data: that.data.downUrl,
      success(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },

  //点击下载文件
  downloadAddress() {
    var that = this;
    that.setData({
      modalName: 'giveModal',
      downUrl: app.globalData.base_url + 'wx/wish/activity/downloadAddress?activityId=' + that.data.activityId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activityId: options.activityId
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
    this.getUserAddress();
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