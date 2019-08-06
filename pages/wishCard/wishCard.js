const app = getApp();
// pages/wishCard/wishCard.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    wishCardNum: '', //心愿卡数量
    num: '', //赠送心愿卡数量
    subBtnStatus: true, //赠送按钮
    recordId: '', //赠送记录Id
    path: '', //赠送心愿卡跳转地址
    info: {},
    modol: false,
    phone:'',//手机系统
    phoneStatus:false,//不同系统显示
  },
  //获取心愿卡数量
  getMyWishcardNum() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/getMyWishcardNum',
      method: 'post',
      data: {},
      header: app.globalData.header,
      success(res) {
        that.setData({
          wishCardNum: res.data.datas
        })
      }
    })
  },
  //跳转到许愿页面
  toWish() {
    wx.switchTab({
      url: '../wish/wish',
    })
  },
  //隐藏系统模态框
  hideGiveModal(){
    this.setData({
      modalName: 'null'
    })
  },

  //跳转到购买页面
  togiveCard() {
    if (this.data.phone == 'iOS') {
      this.setData({
        modalName: 'giveModal'
      })
    } else {
      wx.navigateTo({
        url: '../giveCard/giveCard',
      })
    }

   
  },
  //赠送心愿卡输入为0或者不输入赠送数量时调用
  errorBtn() {
    wx.showToast({
      title: '请输入要赠送的数量',
      icon: 'none',
    })
  },

  //模态框
  showModal(e) {
    if (this.data.num == null || this.data.num == '' || this.data.num == 0) {
      wx.showToast({
        title: '请输入要赠送的数量',
        icon: 'none',
      })
      return ;
    } 
    this.sendWishcardToOther()
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  //隐藏模态框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //提交赠送数量
  subNum() {
    this.setData({
      modalName: null
    })
  },
  //台转到心愿卡明细
  cardDatlie() {
    wx.navigateTo({
      url: '../cardDatlie/cardDatlie',
    })
  },
  //总送后的页面
  sendCard() {
    wx.navigateTo({
      url: '../sendCard/sendCard',
    })
  },
  //赠送张数输入框
  showInput() {
    this.setData({
      modol: true
    })
  },
  // 影藏赠送输入框
  hiddenInput() {
    this.setData({
      modol: false
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
    this.getMyWishcardNum();
    this.setData({
      modalName: null,
      num:''
    })

    //判断手机系统
    if (app.globalData.phone == "iOS") {
      this.setData({
        phone: 'iOS',
        phoneStatus:false
      })
    } else {
      this.setData({
        phone: 'Ad',
        phoneStatus: true
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
  //获取赠送心愿卡数量
  getNum(e) {
    var num = e.detail.value;
    if (num > this.data.wishCardNum) {
      wx.showToast({
        title: '没有那么多心愿卡，请先购买',
        icon: 'none',
      })
      this.setData({
        num: this.data.wishCardNum,
      })
    } else {
      if (num == null || num == ''|| num == 0 ) {
        wx.showToast({
          title: '请输入要赠送的数量',
          icon: 'none',
        })
      } else {
        this.setData({
          num: num,
        })
      }
    }
  },
  //点击确定
  clickBtn() {
    if (this.data.num == "" || this.data.num == 0) {
      wx.showToast({
        title: '请输入要赠送的心愿卡数量',
        icon: 'none',
      })
      return;
    }
  },
  //确认赠送
  sendWishcardToOther() {
    var that = this;
    if (this.data.num == "" || this.data.num == 0) {
      wx.showToast({
        title: '请输入要赠送的心愿卡数量',
        icon: 'none',
      })
      return;
    }
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/sendWishcardToOther',
      method: 'post',
      data: {
        wishCardNum: that.data.num
      },
      sync: false,
      header: app.globalData.header,
      success(res) {
        that.setData({
          recordId: res.data.datas,
          subBtnStatus: false
        })
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: "您的好友送您" + this.data.num + "张心愿卡",
      path: 'pages/sendCard/sendCard?recordId=' + this.data.recordId,
      imageUrl: '/imgs/pageImgs/heart_bg_share.png'
    }
  }
})