const app = getApp();
var timer = false
// pages/checkprice/checkprice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkPrice: [],
    checkStatus: 0,
    comId: "",
    yuanPrice: '',//返回的价格
    payStatus:true
  },
  //获取上首页套餐
  getHomeCombo() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/getWishcardList',
      method: 'POST',
      header: app.globalData.header,
      data: {
        type: 2
      },
      success(res) {

        if (res.data.code == 200) {
          //给默认的上传金额赋值
          var comList = res.data.datas
          for (var i = 0; i < comList.length; i++) {
            if (i == 0) {
              var firstPrze = comList[0].priceYuan
              var firstId = comList[0].id
            }
          }
        }
        that.setData({
          checkPrice: res.data.datas,
          yuanPrice: firstPrze,
          comId: firstId,
        })
      }
    })
  },
  //选择
  checklist(e) {
    this.setData({
      checkStatus: e.currentTarget.dataset.index,
      comId: e.currentTarget.id,
      yuanPrice: e.currentTarget.dataset.prze
    })
  },
  //支付
  //type 商品类型（1：心愿卡，2：上首页，3：高级版）
  //comId 商品类型对应的唯一标识id
  //pageAddr 支付成功后跳转地址,比如：/pages/home/home 完整路径和参数链接 自行处理传null
  //支付成功
  pay() {
    var that = this;
    wx.showLoading({
      title: '请稍后',
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      that.setData({
        payStatus: false,
      })
      //获取静态统计数据
      wx.request({
        url: app.globalData.base_url + 'wx/wish/pay/createOrder',
        method: 'POST',
        header: app.globalData.header,
        data: {
          type: 1,
          comId: that.data.comId,
          yuanPrice: that.data.yuanPrice
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
              success: function (res) {
                //支付成功
                var pages = getCurrentPages()
                var prePage = pages[pages.length - 2]
                prePage.onLoad()
                wx.navigateBack({
                  delta: 1
                })
                // wx.navigateTo({
                //   url: '../wishCard/wishCard'
                // })              
              },
              fail: function () {
                wx.showToast({
                  title: '支付失败，请稍后再试',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            wx.showToast({
              title: '支付失败，请稍后再试！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      });

    }, 500)


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeCombo();
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