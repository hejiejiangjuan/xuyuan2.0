// pages/vipCheck/vipCheck.js
const app = getApp();
var timer=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkStatus:0,
    vipSwitch:true,
    inviolable:[],
    comboList:[],
    useNum:0,
    comId:"",
    yuanPrice:'',//返回的价格
    payStatus:true,
    phoneStatus:true,
  },
  //支付
  //type 商品类型（1：心愿卡，2：上首页，3：高级版）
  //comId 商品类型对应的唯一标识id
  //pageAddr 支付成功后跳转地址,比如：/pages/home/home 完整路径和参数链接 自行处理传null
  //支付成功
  pay() {
    clearTimeout(timer)
    var that = this;
    wx.showLoading({
      title: '请稍后',
    })
    timer=setTimeout(()=>{
      that.setData({
        payStatus: false,
      })
      //获取静态统计数据
      wx.request({
        url: app.globalData.base_url + 'wx/wish/pay/createOrder',
        method: 'POST',
        header: app.globalData.header,
        data: {
          type: 3,
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
                wx.navigateTo({
                  url: '../active/active?vipSwitch=' + that.data.vipSwitch,
                })
              },
              fail: function (res) {
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
    },500) 
  },

//获取高级版权益
  getLeadComboInviolable(){
    var that=this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/lead/getLeadComboInviolable',
      method: 'POST',
      header: app.globalData.header,
      success(res){
        if(res.data.code==200){
          that.setData({
              inviolable:res.data.datas
            })
        }
      }
    })
  },
  //获取高级版套餐
  getLeadComboList(){
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/lead/getLeadComboList',
      method: 'POST',
      header: app.globalData.header,
      success(res) {
        //给默认的上传金额赋值
        var comList=res.data.datas.leadComboVos
        if (res.data.code == 200) {
          for (var i = 0; i < comList.length;i++){
            if(i==0){
              var firstPrze = comList[0].priceYuan
              var firstId=comList[0].id
            }
          }
          that.setData({
            comboList: res.data.datas.leadComboVos,
            useNum: res.data.datas.useNum,
            yuanPrice: firstPrze,
            comId: firstId,
          })
        }
      }
    })
  },
//选择价格
  checklist(e){
    this.setData({
      checkStatus: e.currentTarget.dataset.index,
      comId:e.currentTarget.id,
      yuanPrice:e.currentTarget.dataset.prze
    })
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLeadComboInviolable()
    this.getLeadComboList()
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
    var phone=app.globalData.phone
    if(phone=='iOS'){
      this.setData({
        phoneStatus:true
      })
    }else{
      this.setData({
        phoneStatus:false
      })
    }

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