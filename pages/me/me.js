const app = getApp();
// pages/Me/Me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: "", //上传头像地址
    nickName: "", //昵称
    usereName: "",
    medalName: "", //勋章名称
    medalAddr: "", //勋章Icon地址
    avatarUrl: "", //头像地址
    wishCardNum: "", //心愿卡数量
    userJoinCount: "", //用户参与活动数
    wishDetailCount: "", //许愿数
    userImplCount: "", //实现愿望数量
    createActivityCount: "", //	创建活动数
    totalMsg: "", //未读消息总数
    imgUrlList: "", //头像地址
    addressStatus: true, //用户是否授权获取地址
  },
  //输入昵称
  getNickName(e) {
    this.setData({
      usereName: e.detail.value
    })
  },
  //模态框
  showModal(e) {
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
  //logo上传
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //头像图片选择
  ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, //默认9
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
            if (dataObj.code == 200) {
              that.setData({
                imgUrlList: dataObj.datas,
                imgList: app.globalData.fileServer + dataObj.datas
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
  //调用微信地址接口
  chooseAddress() {
    debugger
    var that = this;
    wx.chooseAddress({
      success(res) {
        that.setData({
          addressStatus: true
        })
      },
      fail(res) {
        that.setData({
          addressStatus: false
        })
      }
    })
  },
  //打开微信收货地址
  address() {
    wx.chooseAddress({
      success(res) {}
    })
  },
  //提交头像
  subWish() {
    var that = this;
    if (that.data.imgUrlList == null || that.data.imgUrlList == "") {
      that.setData({
        imgUrlList: that.data.avatarUrl
      })
    }
    wx.request({
      url: app.globalData.base_url + 'wxUser/updateUserInfo',
      method: 'POST',
      header: app.globalData.header,
      data: {
        nickName: encodeURI(that.data.usereName),
        avatarUrl: encodeURI(that.data.imgUrlList)
      },
      success(res) {
        that.setData({
          modalName: null
        })
        that.getPersonStaticInfo();
      }
    })

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
  //获取未读消息数量
  getMessageCount() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'wx/wish/message/getMessageCount',
      method: 'get',
      data: {},
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas.total_msg != null) {
            that.setData({
              totalMsg: res.data.datas.total_msg
            })
          }
        }
      }
    })
  },

  //许下的心愿
  makeWish() {
    wx.navigateTo({
      url: '../me-makewish/me-makewish',
    })
  },
  //参与的活动
  activelved() {
    wx.navigateTo({
      url: '../me-activeJion/me-activeJion',
    })
  },
  //实现的心愿
  impWish() {
    wx.navigateTo({
      url: '../inpleWish/inpleWish',
    })
  },
  //发起的活动
  initiateActive() {
    wx.navigateTo({
      url: '../me-initiateActive/me-initiateActive',
    })
  },
  //我的心愿卡
  mywishCard() {
    wx.navigateTo({
      url: '../wishCard/wishCard',
    })
  },
  //跳转到常见问题
  problems() {
    wx.navigateTo({
      url: '../problems/problems',
    })
  },
  //跳转到消息通知
  message() {
    wx.navigateTo({
      url: '../me-message/me-message',
    })
  },
  //跳转到联系我们
  contact() {
    wx.navigateTo({
      url: '../me-contact/me-contact',
    })
  },
  //关于我们
  aboutUs() {
    wx.navigateTo({
      url: '../me-aboutUs/me-aboutUs',
    })
  },
  //商务合作
  cooperation() {
    wx.navigateTo({
      url: '../me-cooperation/me-cooperation',
    })
  },
  //问题反馈
  feedback() {
    wx.navigateTo({
      url: '../me-feedback/me-feedback',
    })
  },
  //跳转到心愿达人
  wishTalent() {
    wx.navigateTo({
      url: '../wishTalent/wishTalent',
    })
  },
  //调用个人中心数据接口
  getPersonStaticInfo() {
    var that = this;
    wx.request({
      url: app.globalData.base_url + 'personal/getPersonStaticInfo',
      method: 'get',
      data: {},
      header: app.globalData.header,
      success(res) {
        if (res.data.datas.curMedal == null || res.data.datas.curMedal == "") {
          that.setData({
            medalName: '点击领取勋章', //勋章名称
            medalAddr: '', //勋章Icon地址
          })
        } else {
          that.setData({
            medalName: res.data.datas.curMedal.medalName, //勋章名称
            medalAddr: app.globalData.fileServer + '/' + res.data.datas.curMedal.addr, //勋章Icon地址
          })
        }
        that.setData({
          nickName: res.data.datas.nickName, //昵称
          usereName: res.data.datas.nickName, //昵称
          avatarUrl: res.data.datas.avatarUrl, //头像地址
          imgList: res.data.datas.avatarUrl, //头像地址
          userJoinCount: res.data.datas.userJoinCount, //用户参与活动数
          wishDetailCount: res.data.datas.wishDetailCount, //许愿数
          userImplCount: res.data.datas.userImplCount, //实现愿望数量
          createActivityCount: res.data.datas.createActivityCount, //	创建活动数
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPersonStaticInfo();
    this.getMyWishcardNum();
    this.getMessageCount();

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
    this.getPersonStaticInfo();
    this.getMyWishcardNum();
    this.getMessageCount();
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