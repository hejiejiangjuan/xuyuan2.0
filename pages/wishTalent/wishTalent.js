const app = getApp();
// pages/wishTalent/wishTalent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curMedal: {}, //当前佩戴勋章
    medalTypes: [], //勋章列表
    fileServerUrl: app.globalData.fileServer,
    integralNum: '', //当前积分
  },
  //佩戴勋章
  changeMedalType(e) {
    var typeId = e.currentTarget.dataset.item.id;
    if (typeId == this.data.curMedal.id) {
      wx.showToast({
        title: '已佩戴此勋章',
        icon: 'none'
      })
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'personal/changeMedalType',
      method: 'POST',
      header: app.globalData.header,
      data: {
        medalId: typeId
      },
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '佩戴成功',
          })
          that.getMedalType();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        that.getMedalType();
      }
    })
  },
  //获取我的勋章和列表接口
  getMedalType() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'personal/getMedalType',
      method: 'POST',
      header: app.globalData.header,
      data: {},
      success(res) {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.datas.medalTypes.length; i++) {
            res.data.datas.medalTypes[i].addr = that.data.fileServerUrl + res.data.datas.medalTypes[i].addr;
            if (res.data.datas.integralNum <= res.data.datas.medalTypes[i].integralNum) {
              res.data.datas.medalTypes[i].progress = res.data.datas.integralNum / res.data.datas.medalTypes[i].integralNum * 100 + '%';
            } else {
              res.data.datas.medalTypes[i].progress = '100%';
            }
          }
          if (res.data.datas.curMedal != null) {
            res.data.datas.curMedal.addr = that.data.fileServerUrl + res.data.datas.curMedal.addr;
            that.setData({
              curMedal: res.data.datas.curMedal
            })
          }
          that.setData({
            integralNum: res.data.datas.integralNum,
            medalTypes: res.data.datas.medalTypes
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
        console.log(that.data.medalTypes)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
    this.getMedalType();
    let that = this;
    setTimeout(function () {
      that.setData({
        loading: true
      })
    }, 500)
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