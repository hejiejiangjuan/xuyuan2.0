// pages/activeJion/activeJion.js
var app = getApp()
var time=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileServer: app.globalData.fileServer, //文件服务器地址,
    prizinfo: [{
      maxPaymentYuan: "请选择"
    }],
    info: [], //类型
    typearr: [], //
    activ: 100,
    checkboxStatus1: false,
    priceList: [],
    date: '2018-1-1',
    region: ['四川', '成都', '锦江区'],
    actvieId: '', //活动id
    ativeData: {},
    citys: [], //自定义地区信息
    multiIndex: [0, 0], //自定义地区信息
    selectArea: [], //自定义地区信息
    tempIndex: [0, 0], //自定义地区信息
    provincialId: '', //省id
    cityId: '', //市id
    randomName: "", //随机昵称
    activity_wish_list: [], //返回心愿类型
    checkStatus: false, //是否选择心愿卡
    wishCardNum: 0, //上传的心愿卡数量
    story: "", //背后的故事
    wechatNo: '', //微信
    sync:false,//是否同步星海
    activityTheme:"",//活动主题
    btnStatus:true,
    msg:''
  },
  //提交成功后跳转
  subInfo() {
    clearTimeout(time)
    time=setTimeout(()=>{    
      var that = this
      that.setData({
        btnStatus:false
      })
      for (var i = 0; i < that.data.activity_wish_list.length; i++) {
        if (!that.data.activity_wish_list[i].wishContent) {
          wx.showToast({
            title: '请填写心愿内容',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            btnStatus: true
          })
          return
        }
      }

      if (!that.data.story) {
        wx.showToast({
          title: '请填背后的故事',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          btnStatus: true
        })
        return
      }
      if (!that.data.wechatNo) {
        wx.showToast({
          title: '请填写微信',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          btnStatus: true
        })
        return
      }
      wx.showLoading({
        title: '正在提交数据',
      })

      wx: wx.request({
        url: app.globalData.base_url + 'wx/wish/activity/addWishDetail',
        method: 'post',
        header: app.globalData.header,
        data: {
          wishList: encodeURI(JSON.stringify(that.data.activity_wish_list)),
          wishCardNum: encodeURI(that.data.wishCardNum),
          reachDate: encodeURI(that.data.date),
          story: encodeURI(that.data.story),
          wechatNo: encodeURI(that.data.wechatNo),
          provincialId: encodeURI(this.data.selectArea[0][this.data.multiIndex[0]].id),
          cityId: encodeURI(this.data.selectArea[1][this.data.multiIndex[1]] ? this.data.selectArea[1][this.data.multiIndex[1]].id : ''),
          activityId: encodeURI(this.data.actvieId),
          sync: encodeURI(that.data.sync),
          nickName: encodeURI(that.data.randomName)

        },
        success: function (res) {
          if (res.data.code == 200) {
            //清空表单
            that.setData({
              getWishcon:'',
              storyText:'',
              weChat:'',
            })
            that.setData({
              btnStatus: true
            })
            wx.navigateTo({
              url: '../evenDetails/evenDetails?id=' + that.data.actvieId + '&from=add',
            })
          }else{
            that.setData({
              btnStatus: true,
              modalName:"Modal",
              msg: res.data.message
            })

          }
          wx.hideLoading()
        },
      })
    },500)
  },
  //是否花费心愿卡
  // checkStatus(e) {
  //   this.setData({
  //     checkStatus: !this.data.checkStatus
  //   })
  //   if (this.data.checkStatus) {
  //     this.setData({
  //       wishCardNum: e.currentTarget.dataset.num
  //     })
  //   }

  // },
 
  //和获取昵称
  nickeName(e){
  this.setData({
    randomName:e.detail.value
  })
  },
  //是否同步星海
  switch1change(e) {
    this.setData({
      sync: e.detail.value
    })
  },
  //获取微信
  weChatInput(e) {
    this.setData({
      wechatNo: e.detail.value
    })
  },
  //获取心愿内容
  getWishcon(e) {
    var typeIndex = e.currentTarget.dataset.index
    this.data.activity_wish_list[typeIndex].wishContent = e.detail.value
  },
  //时间选择
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //禁用早与当前的时间并获取当前时间
  disTime() {
    var time = new Date()
    this.setData({
      tday: time.getDate(),
      tMonth: time.getMonth(),
      tYear: time.getFullYear(),
      date: time.getFullYear() + '-' + parseInt(time.getMonth() + 1) + '-' + time.getDate(),
    })
  },
  //获取背后故事
  storyInput(e) {
    this.setData({
      story: e.detail.value
    })
  },


  //点击随机昵称
  randomName() {
    var that = this
    //先从缓存中读取
    var random = wx.getStorageSync('randomName');
    if (random != '' && random.length > 0) {
      that.setData({
        randomName: random[0].name
      })
      wx.setStorageSync('randomName', random.splice(1));
      return;
    }
    //随机昵称
    wx.request({
      url: app.globalData.base_url + 'wishDetail/getRandomDefaultNickName',
      method: 'GET',
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          //数据加入缓存
          if (data.datas.length > 2) {
            var random = data.datas.splice(1);
            wx.setStorageSync('randomName', random);
          }
          that.setData({
            randomName: data.datas[0].name
          })
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
  //地区xuanze
  RegionChange: function(e) {
    var proArr = e.detail.value
    this.setData({
      region: e.detail.value,
      provincialId: proArr[0],
      cityId: proArr[1]
    })
  },
  clickArea() {
    this.data.tempIndex = JSON.parse(JSON.stringify(this.data.multiIndex));
    this.data.tempSelArea = JSON.parse(JSON.stringify(this.data.selectArea));
  },
  bindcancel(e) {
    this.setData({
      multiIndex: this.data.tempIndex,
      selectArea: this.data.tempSelArea
    });
  },
  bindMultiPickerColumnChange(e) {
    var that = this;
    const data = {
      selectArea: this.data.selectArea,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        var pid = that.data.provinces[data.multiIndex[0]].id;
        var cityList = [];
        for (var i = 0; i < that.data.citys.length; i++) {
          if (pid == that.data.citys[i].pid) {
            cityList.push(that.data.citys[i]);
          }
        }
        data.selectArea[1] = cityList;
    }
    this.setData(data)
  },
  //随机获取地区信息
  getReadyInfo() {
    var that = this;
    
    //省份信息
    wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getAllProvincial',
      method: 'POST',
      data: {
        type: 1
      },
      header: app.globalData.header,
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            provinces: data.datas
          })
          //城市信息
          wx.request({
            url: app.globalData.base_url + 'wx/wish/public/getAllCity',
            method: 'POST',
            data: {
              type: 1
            },
            header: app.globalData.header,
            success(res) {
              const data = res.data;
              if (data.code == 200) {
                that.setData({
                  citys: data.datas
                })
                var cityList = [];
                for (var i = 0; i < that.data.citys.length; i++) {
                  if (that.data.provinces[0].id == that.data.citys[i].pid) {
                    cityList.push(that.data.citys[i]);
                  }
                }
                that.setData({
                  'selectArea[0]': that.data.provinces,
                  'selectArea[1]': cityList
                });
              } else {
                wx.showToast({
                  title: '系统错误，请稍后重试',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          });
        } else {
          wx.showToast({
            title: '系统错误，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });

  },
  //删除心愿类型
  // deleModal(e) {
  //   console.log(e.currentTarget.dataset.index)
  //   const delefo = this.data.info
  //   if (e.currentTarget.dataset.index >= 1) {
  //     delefo.splice(e.currentTarget.dataset.index, 1)
  //   }
  //   this.setData({
  //     info: delefo
  //   })
  // },
  //达成心愿模态框
  showModal2(e) {
    this.setData({
      modalName1: e.currentTarget.dataset.target1,
      textaStatus: true,
      btnstatus: true,
    })

  },
  //影藏模态框
  hideModal(e) {
    this.setData({
      modalName: null,
      modalName1: null,
      btnstatus: false,
      textaStatus: '',
    })
  },
  //确认金额
  subPriz() {
    const myinfo = this.data.prizarr
    this.setData({
      prizinfo: myinfo,
      modalName1: null,
      btnstatus: false,
      textaStatus: '',
    })
  },
  //选择金额，将这个金额对象储存到一个数组
  chooseType1(e) {
    if (this.data.checkboxStatus) {
      this.setData({
        checkboxStatus1: true
      })
    } else {
      this.setData({
        checkboxStatus1: true
      })
    }
    var arr = []
    arr.push(e.currentTarget.dataset.item)
    this.setData({
      activ: e.currentTarget.dataset.item.id,
      prizarr: arr,
      checkboxStatus1: !this.data.checkboxStatus1,
    })
  },
  //失焦获取input自定义金额
  getValue(e) {
    var arr = [{
      maxPaymentYuan: e.detail.value
    }]
    this.setData({
      prizarr: arr
    })
  },
  //确认金额
  subPriz() {
    const myinfo = this.data.prizarr
    this.setData({
      prizinfo: myinfo,
      modalName1: null,
      btnstatus: false,
      textaStatus: '',
    })
  },
  //单选按钮状态
  checkbox() {
    this.setData({
      // checkboxStatus: !this.data.checkboxStatus,
      checkboxStatus1: !this.data.checkboxStatus1,
      activ: 100
    })
  },

  //获取活动详情数据
  init() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailById',
      header: app.globalData.header,
      method: 'POST',
      data: {
        activityId: that.data.actvieId
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            ativeData: res.data.datas,
            activity_wish_list: res.data.datas.activity_wish_list,
            activityTheme: res.data.datas.activityTheme,
            // wishcardNum: res.data.datas.activityTheme
          })
        }
      }
    })
  },
  //获取价格区间
  getWishPriceList() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wishDetail/getWishPriceList',
      header: app.globalData.header,
      method: 'POST',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            priceList: res.data.datas
          })
        }

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      actvieId: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.init()
    this.getWishPriceList()
    this.getReadyInfo()
    this.randomName()
    this.disTime()
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

  }
})