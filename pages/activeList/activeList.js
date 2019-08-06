// pages/activeList/activeList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [], //轮播
    activeList: [],
    fileServer: app.globalData.fileServer,
    activeId: "",
    code: 0,
    msg: "",
    activeDetal: {},
    showModal: false, //是否显示授权窗
  },
  //轮播跳转
  pageTo(e) {
    var index = e.currentTarget.id;
    var obj = this.data.swiperList[index];
    switch (obj.jumpType) {
      case '1':
        //活动详情
        wx.navigateTo({
          url: '../evenDetails/evenDetails?id=' + obj.activityId,
        })
        break
      case '2':
        //小程序
        if (obj.miniPath) {
          wx.navigateToMiniProgram({
            appId: obj.miniAppid,
            path: obj.miniPath
          })
        } else {
          wx.navigateToMiniProgram({
            appId: obj.miniAppid,
          })
        }
        break;
      case '3':
        //内嵌
        wx.navigateTo({
          url: '../toH5Page/toH5Page?addr=' + encodeURIComponent(obj.extJumpAddr),
        })
        break
      default:
    }
  },
  //参与活动条件判断
  getAddWishDetailCheck(target) {

    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getAddWishDetailCheck',
      header: app.globalData.header,
      method: 'post',
      data: {
        activityId: that.data.activeId
      },
      success: function(res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../activeJion/activeJion?id=' + that.data.activeId,
          })
        } else if (res.data.code == 401) {
          //关注公众号数据获取（判断是否授权）
          app.addNewUserInfo().then(function (res) {
            if (res == 'fail') {
              return
            }
            //不是粉丝
            that.setData({
              modalName: target,
              code: 401
            })
          })
        } else if (res.data.code == 403) {
          //心愿卡数量不足
          that.setData({
            modalName: target,
            code: 403,
            msg: res.data.message
          })

        } else {
          //其他
          that.setData({
            modalName: target,
            msg: res.data.message
          })
        }
      },

    })
  },
  //去购买心愿卡
  togive() {
    //判断手机系统
    if (app.globalData.phone == "iOS") {
      this.setData({
        modalName: 'giveModal'
      })
    } else {
      wx.navigateTo({
        url: '../giveCard/giveCard',
      })
      this.setData({
        modalName:null
      })
    }
  },
  //隐藏模态框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //跳转到发起活动页
  addactive() {
    wx.navigateTo({
      url: '../active/active',
    })
  },
  //立即参加
  detailActive(e) {
    var that = this;
    that.setData({
      activeId: e.currentTarget.dataset.item.id,
      activeDetal: e.currentTarget.dataset.item
    })
    that.getAddWishDetailCheck(e.currentTarget.dataset.target)
  },
  //跳转详情
  detliaActive(e) {
    wx.navigateTo({
      url: '../evenDetails/evenDetails?id=' + e.currentTarget.dataset.id + '&from=list',
    })
  },
  //获取轮播数据
  getCarousel() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getCarousel',
      header: app.globalData.header,
      method: 'post',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            swiperList: res.data.datas
          })
        }
      }

    })
  },
  //获取活动列表
  getHotActivity() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getHotActivity',
      header: app.globalData.header,
      method: 'post',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            activeList: res.data.datas
          })
        }
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
    this.getCarousel()
    this.getHotActivity()
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
  manaGement() { //允许授权
    var that = this;
  },
})