// pages/evenDetails/evenDetails.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    copyLink: JSON.stringify({
      'type': 'copyLink'
    }),
    options: null,
    showModal: false, //是否显示授权窗
    actvieId: "", //活动id
    pageFrom: "", //页面来自哪里
    lastUserId: "",
    activeDetal: "", //详情页数据
    fileServer: app.globalData.fileServer,
    helpList: [],
    imgNum: 0,
    userHelpList: [],
    user_prize: [], //中奖人头像
    jion_userImg: [], //参与人底部显示头像
    jionUser: [], //总共参与人数
    code: 0,
    currentPrize: {}, //中奖信息
    address: {}, //中奖收获地址
    msg: "",
    fromStatu: true,
    isUserAddress: false, //判断当前用户是否已填写收货地址
    userAddress: [], //中奖者收货信息列表
  },


  //返回首页
  backPage() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //成功后的模态框
  showModalWin(e) {
    this.setData({
      modalNamewin: 'Modal',
    })
  },
  //模态框
  showPageModal(e) {
    var that = this

    
      wx.request({
        url: app.globalData.base_url + 'wx/wish/activity/getAddWishDetailCheck',
        header: app.globalData.header,
        method: 'post',
        data: {
          activityId: that.data.actvieId,
        },
        success(res) {
          if (res.data.code == 200) {
            //跳转到填写页
            wx.navigateTo({
              url: '../activeJion/activeJion?id=' + that.data.actvieId,
            })

          } else if (res.data.code == 401) {
            //关注公众号数据获取（判断是否授权）
            app.addNewUserInfo().then(function (res) {
              if (res == 'fail') {
                return
              }
              //不是粉丝
              that.setData({
                modalName: e.currentTarget.dataset.target,
                code: 401,
                msg: res.data.message
              })

            })
          } else if (res.data.code == 403) {
            //心愿卡不足
            that.setData({
              modalName: e.currentTarget.dataset.target,
              code: 403,
              msg: res.data.message
            })
          } else {
            //其他
            that.setData({
              modalName: e.currentTarget.dataset.target,
              msg: res.data.message
            })
          }
        }
      })

  },
  //获取中奖用户收货地址信息
  getUserAddress() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getUserAddress',
      header: app.globalData.header,
      method: 'post',
      data: {
        activityId: encodeURI(that.data.actvieId),
      },
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas != null) {
            that.setData({
              userAddress: res.data.datas,
              userCount: res.data.datas.length
            })
          } else {
            that.setData({
              userCount: 0
            })
          }
        }
      }
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
        modalName: null
      })
    }
  },
  //隐藏模态框
  hideModal(e) {
    this.setData({
      modalName: null,
      modalNamewin: null
    })
  },
  //生成海报
  detailsCanvas() {
    wx.navigateTo({
      url: '../detailCanvas/detailCanvas?id=' + this.data.actvieId,
    })
  },
  //底部模态框
  bottomShowModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })

  },
  //不允许分享提示
  // noneShare() {
  //   wx.showToast({
  //     title: '不允许分享',
  //     icon: 'none'
  //   })
  // },
  //高级版生成海报
  generatePoster() {
    wx.navigateTo({
      url: '../detailCanvas/detailCanvas?id=' + this.data.actvieId,
    })
  },
  //嵌入公众号的canvas
  embedded() {
    wx.navigateTo({
      url: '../embedded/embedded?id=' + this.data.actvieId,
    })
  },
  //跳转中奖者信息
  winner() {
    var that = this;
    wx.navigateTo({
      url: '../winner/winner?activityId=' + that.data.actvieId,
    })
  },
  //跳转至选择收货地址页面
  chooseAddress() {
    var that = this;
    wx.navigateTo({
      url: '../winningDetails/winningDetails?prizeId=' + that.data.currentPrize.id + "&activityId=" + that.data.actvieId,
    })
  },
  //跳转到头像也
  userImg() {
    wx.navigateTo({
      url: '../jionUsers/jionUsers?params=' + JSON.stringify(this.data.jionUser),
    })
  },
  //获取当前用户收获地址
  getUserInfoAddress() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getUserInfoAddress',
      header: app.globalData.header,
      method: 'post',
      data: {
        prizeId: encodeURI(that.data.currentPrize.id)
      },
      success(res) {
        if (res.data.code == 200) {
          if (res.data.datas == null) {
            that.setData({
              isUserAddress: false
            })
          } else {
            that.setData({
              isUserAddress: true
            })
          }
        }
      }
    })
  },
  //初始化详情页数据
  getActivityDetailById() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailById',
      header: app.globalData.header,
      method: 'post',
      data: {
        activityId: that.data.actvieId,
        lastUserId: that.data.lastUserId
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            isCreatUser: res.data.datas.isCreatUser
          })
          //封装content
          var obj = res.data.datas;
          if (obj.lead == 0) {
            obj.detail_content = app.restoreNewLine(obj.detail_content);
          }
          //判断需要助力时，处理助力人数字段为数组
          var userHelpList = []
          var currentPrize = {}
          if (!res.data.datas.currentPrize) {
            that.setData({
              currentPrize: currentPrize
            })
          } else {
            that.setData({
              currentPrize: res.data.datas.currentPrize
            })
            that.getUserInfoAddress();
          }
          if (!res.data.datas.userHelpList) {
            that.setData({
              userHelpList: userHelpList,
              activeDetal: res.data.datas,
            })
          } else {
            that.setData({
              userHelpList: res.data.datas.userHelpList,
              activeDetal: res.data.datas,
            })
          }
          that.onEditorReady()
          //处理页面只10个助力人数
          var helpList = []
          for (var i = 0; i < that.data.userHelpList.length; i++) {
            if (i <= 10) {
              helpList.push(that.data.userHelpList[i])
            }

          }
          that.setData({
            helpList: helpList
          })

          //判断还需要多少人助力显示占位图的多少
          if (that.data.activeDetal.needHelp == 1) {
            if (that.data.activeDetal.helpNum <= 10) {
              that.setData({
                imgNum: that.data.activeDetal.helpNum
              })
            } else {
              that.setData({
                imgNum: 10
              })
            }
          }
          //处理中奖人头像数组
          if (res.data.datas.activity_wish_list != null) {
            for (var i = 0; i < res.data.datas.activity_wish_list.length; i++) {
              if (!res.data.datas.activity_wish_list[i].user_prize) {
                var priceUser = []
                that.setData({
                  user_prize: priceUser
                })
              } else {
                that.setData({
                  user_prize: res.data.datas.activity_wish_list[i].user_prize
                })
              }
            }
          }
          //处理参加活动人员头像显示数据
          if (!res.data.datas.user_join_activity) {
            var jionActive = []
            that.setData({
              jionUser: jionActive
            })
          } else {
            that.setData({
              jionUser: res.data.datas.user_join_activity
            })
          }
          //判断头像显示9张
          var jion_userImg = []
          for (var i = 0; i < that.data.jionUser.length; i++) {
            if (i <= 9) {
              jion_userImg.push(that.data.jionUser[i])
            }
          }
          that.setData({
            jion_userImg: jion_userImg
          })
          //防止模态框数据延迟
          if (that.data.activeDetal) {
            that.showModu()
          }
          that.onShareAppMessage();
          that.getUserAddress();
        }
      }
    })
  },
  //初始化富文本
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function(res) {
      if (res != null) {
        that.editorCtx = res.context
        if (that.data.activeDetal.detail_content != '') {
          that.editorCtx.setContents({
            html: that.data.activeDetal.detail_content,
            success: function() {}
          })
        }
      }
    }).exec()
  },
  //获取活动id和lastUserId
  initOnLoad(options) {
    var lastUserId = options.lastUserId
    //如果通过分享进存lastUserId
    if (lastUserId != null && lastUserId != 'undefined') {
      this.setData({
        lastUserId: lastUserId
      })
    } else {
      this.setData({
        lastUserId: null
      })
    }
    //存id 
    if (options.id != null || options.id != undefined) {
      this.setData({
        actvieId: options.id,
      })
    }
    //如果通过列表或者“参加活动表单”进存一个状态，区别模态框是否弹出
    if (options.from != null || options.from != undefined) {
      this.setData({
        pageFrom: options.from,
      })
    }
    //通过二维码进来
    const scene = decodeURIComponent(options.scene)
    if (scene != null && scene != 'undefined') {
      var id = app.GetUrlParame(scene, 'id');
      var lastUserId = app.GetUrlParame(scene, 'lastUserId');
      this.setData({
        actvieId: id,
      })
      if (lastUserId) {
        this.setData({
          lastUserId: lastUserId,
        })
      }
    }
  },
  //参加更多心愿活动
  moreActive() {
    wx.switchTab({
      url: '../activeList/activeList',
    })
  },
  //复制
  copyPublicCommand() {
    var that = this
    wx.setClipboardData({
      data: that.data.activeDetal.publicCommand,
      success(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  //开奖按钮
  openPrize() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/handOpenPrize',
      header: app.globalData.header,
      method: 'post',
      data: {
        activityId: that.data.actvieId
      },
      success(res) {
        if (res.data.code == 200) {
          that.getActivityDetailById()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
  },
  //跳转到反馈意见
  feedback() {
    wx.navigateTo({
      url: '../me-feedback/me-feedback',
    })
  },
  //跳转到联系我们
  contact() {
    wx.navigateTo({
      url: '../me-contact/me-contact',
    })
  },
  //跳转到举报
  report() {
    wx.navigateTo({
      url: '../report/report?objectId=' + this.data.actvieId,
    })
  },
  //跳转到关于我们
  about() {
    wx.navigateTo({
      url: '../me-aboutUs/me-aboutUs',
    })
  },

  //如果pageFrom有值，并且是通过参加活动进来才显示模态框
  showModu() {
    var scene = wx.getLaunchOptionsSync();
    console.log(scene)
    console.log(this.data.pageFrom)
    // scene == 1001 || scene.scene == 1005 || scene.scene == 1006 || scene.scene == 1007 || scene.scene == 1008 || scene.scene == 1011 || scene.scene == 1047 || scene.scene == 1073
    if (scene.scene) {
      if (this.data.pageFrom != null && this.data.pageFrom != undefined && this.data.pageFrom !='') {
        console.log(4)
        if (this.data.pageFrom == "add") {
          this.showModalWin()
          this.setData({
            fromStatu: true
          })
        } else {
          this.setData({
            fromStatu: true
          })
        }
      }else{
        console.log(5)
        this.setData({
          fromStatu: false
        })
      }
    }else{
      console.log(6)
    }
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
    var that = this
    var options = null;
    if (this.data.options) {
      options = this.data.options
    } else {
      setTimeout(function() {
        that.onShow();
      }, 100);
    }
    //判断是否未登陆
    if (!app.globalData.userInfo || !app.globalData.header) {
      app.myLogin().then(function(res) {
        if (!('unauth' == res)) {
          that.initOnLoad(options)
          that.getActivityDetailById()
        }
      })
    } else {
      that.initOnLoad(options)
      that.getActivityDetailById()
      //获取登录时的userid
      that.setData({
        getUserId: app.globalData.userInfo.id
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
    return {
      title: this.data.activeDetal.activityTheme,
      path: 'pages/evenDetails/evenDetails?id=' + this.data.activeDetal.id + '&lastUserId=' + app.globalData.userInfo.id,
      imageUrl: app.globalData.fileServer + this.data.activeDetal.themeAddr
    }
  },
  manaGement() { //允许授权
    var that = this;
    that.onShow()
  },
  toOtherMini() {
    var that = this;
    wx.navigateToMiniProgram({
      appId: that.data.activeDetal.miniAppid,
    })
  }
})