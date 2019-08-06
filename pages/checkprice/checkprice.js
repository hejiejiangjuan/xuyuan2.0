const app = getApp();
// pages/checkprice/checkprice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkPrice: [],
    checkStatus: 0,
    id: '',
    teme:false,
    payStatus:true,
    phoneStatus:true,

  },
  //获取上首页套餐
  getHomeCombo() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/homeCombo/getHomeCombo',
      method: 'POST',
      header: app.globalData.header,
      data: {
        type: 2
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            checkPrice: res.data.datas,
          })
        }
      }
    })
  },

  pay() {
    var that=this
    wx.showLoading({
      title: '请稍后',
    })
    clearTimeout(that.data.time)
    that.data.time = setTimeout(function() {
      that.setData({
        payStatus:false,
      })
      var obj = that.data.checkPrice[that.data.checkStatus];
      //获取静态统计数据
      wx.request({
        url: app.globalData.base_url + 'wx/wish/pay/createOrder',
        method: 'POST',
        header: app.globalData.header,
        data: {
          type: 2,
          comId: obj.id,
          yuanPrice: obj.priceYuan
        },
        success(res) {
          if (res.data.code == 200) {
            var wxPay = res.data.datas.wxPay;
            var orderNo = res.data.datas.orderNo;
            // var appId = wxPay.appId;
            var timeStamp = wxPay.timeStamp;
            var nonceStr = wxPay.nonceStr;
            var packageValue = wxPay.packageValue;
            var paySign = wxPay.paySign;
            var signType = wxPay.signType;
            that.setData({
              payStatus: true,
            })
            wx.hideLoading()
            wx.requestPayment({
              timeStamp: timeStamp,
              nonceStr: nonceStr,
              package: packageValue,
              signType: signType,
              paySign: paySign,
              success: function(res) {
                //支付成功
                that.createHome(orderNo);
                wx.switchTab({
                  url: '../index/index',
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: '支付失败，请稍后再试',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            wx.showToast({
              title: '支付失败，请稍后再试',
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
    }, 500)
  },

  createHome(orderNo) {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/homeCombo/createHome',
      method: 'POST',
      header: app.globalData.header,
      data: {
        orderNo: orderNo,
        targetId: that.data.id
      },
      success(res) {
      }
    })
  },
  //选择
  checklist(e) {
    this.setData({
      checkStatus: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.setData({
      id: id
    });
    this.getHomeCombo();
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

    var phone = app.globalData.phone
    if (phone == 'iOS') {
      this.setData({
        phoneStatus: true
      })
    } else {
      this.setData({
        phoneStatus: false
      })
    }

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