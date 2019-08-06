// pages/wish/wish.js
const app = getApp();
const util = require('../../utils/util.js');
//构造心愿类型
function Detail(name, num, type, con) {
  this.wishName = name;
  this.useNum = num;
  this.type = type;
  this.wishContent = ""
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgSrc: "https://file.heidouinfo.com/default/wish/bg.png",
    date: '2018-1-1',
    subdate: '', //需要上传的世家你
    region: ['四川', '成都', '锦江区'],
    index: null,
    picker: ['喵喵喵', '汪汪汪', '哼唧哼唧'],
    btnstatus: false,
    textaStatus: "",
    info: [{}], //渲染类型
    typearr: [], //
    priz: [],
    prizarr: [],
    tyepIndex: '', //
    activ: 0,
    checkboxStatus: false,
    checkboxPaymentStatus: false,
    prizinfo: [{}], //显示的价格区间
    typeData: [], //获取的许愿类型
    prizeData: [], //获取的金额区间
    storyText: "", //背后的故事
    weixin: '', //微信
    getnickName: '', //署名
    provincialId: '', //省id
    cityId: '', //市id
    withPriceIntervalId: '', //价格区间id
    tday: '',
    tMonth: '',
    tYear: '',
    stuCard: false,
    wishCardNum: 0, //上传的心愿卡数量
    randomName: '', //随机昵称
    citys: [], //自定义地区信息
    multiIndex: [0, 0], //自定义地区信息
    selectArea: [], //自定义地区信息
    tempIndex: [0, 0], //自定义地区信息
    giveNum: 0, //返回得心愿卡数量
    buttonClicked: false,
    customPaymentYuan:'',//自定义金额
    buttonClicked:false,
  },
  //获取fromId
  getFromId(e){
  },
  //提交许下的愿望
  subMitWish(e) {  
    var that = this
    util.buttonClicked(that)
    for (var i = 0; i < that.data.info.length; i++) {
      if (!this.data.info[i].wishContent) {
        wx.showToast({
          title: '请填写心愿内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (that.data.info[i].id === undefined) {
        wx.showToast({
          title: '请选择心愿类型',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if (!this.data.storyText) {
      wx.showToast({
        title: '请填写心愿故事',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.weixin) {
      wx.showToast({
        title: '请填写微信号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.withPriceIntervalId == "" && that.data.withPriceIntervalId != '0') {
      wx.showToast({
        title: '请选择价格区间',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '正在提交心愿',
    })
    wx.request({
      url: app.globalData.base_url + 'wishDetail/addWishDetail',
      method: 'POST',
      header: app.globalData.header,
      data: {
        wishList: encodeURI(JSON.stringify(that.data.info)),
        reachDate: encodeURI(that.data.subdate),
        story: encodeURI(that.data.storyText),
        wechatNo: encodeURI(that.data.weixin),
        nickName: encodeURI(that.data.getnickName ? that.data.getnickName : that.data.randomName),
        anonymity: encodeURI('0'),
        provincialId: encodeURI(that.data.provincialId ? that.data.provincialId : 1),
        cityId: encodeURI(that.data.cityId ? that.data.cityId : 1),
        withPriceIntervalId: encodeURI(that.data.withPriceIntervalId ? that.data.withPriceIntervalId : 0),
        customPaymentYuan: encodeURI(that.data.customPaymentYuan), 
        wishCardNum: encodeURI(that.data.wishCardNum),
      },
      success(res) {
        //许愿成功跳转
        if (res.data.code == 200) {
          //清空列表
          that.setData({
            wishCont: '',
            prizinfo: [{}],
            storyText: '',
            weixin: '',
          })
          var data = res.data.datas;
          wx.navigateTo({
            url: '../wishSuccess/wishSuccess?id=' + data.id,
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          return
        }

      }
    })


  },
  //是否使用心愿卡
  checkBtn(e) {
    this.setData({
      stuCard: !this.data.stuCard,
    })
    var wishCardNum = 0;
    if (this.data.stuCard) {
      wishCardNum = e.currentTarget.dataset.num
      if (this.data.giveNum < wishCardNum) {
        this.setData({
          modalName: "wishModal"
        })
      }
    }
    this.setData({
      wishCardNum: wishCardNum
    })
  },
  //获取心愿卡数量
  getCardNum() {
    wx.request({
      url: app.globalData.base_url + 'wx/wish/wishcard/getMyWishcardNum',
      method: 'POST',
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          giveNum: res.data.datas
        }
      }
    })
  },
  //去购买心愿卡数量
  togive() {
    //判断手机系统
    if (app.globalData.phone == "iOS") {
     this.setData({
       modalName:'giveModal'
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
  //获取署名
  getnickName(e) {
    this.setData({
      getnickName: e.detail.value
    })
  },
  //获取微信
  getweixin(e) {
    this.setData({
      weixin: e.detail.value
    })
  },

  //获取背后的故事
  textareaAInput(e) {
    this.setData({
      storyText: e.detail.value
    })

  },
  //禁用早与当前的时间
  disTime() {
    var time = new Date()
    this.setData({
      tday: time.getDate(),
      tMonth: time.getMonth(),
      tYear: time.getFullYear(),
      date: time.getFullYear() + '-' + parseInt(time.getMonth() + 1) + '-' + time.getDate(),
      //当前时间转时间戳
      subdate: time.getTime(),
    })
  },

  //时间选择
  DateChange(e) {
    this.setData({
      date: e.detail.value,
      //指定时间转时间戳
      subdate: new Date(e.detail.value).getTime(),
    })
  },
  //地区xuanze
  RegionChange: function(e) {
    var proArr = e.detail.value

    this.setData({
      region: e.detail.value,
      provincialId: this.data.selectArea[0][proArr[0]].id,
      cityId: this.data.selectArea[1][proArr[1]].id
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
  getRandomDefaultNickName() {
    //随机昵称
    var that = this;
    //先从缓存中读取
    var random = wx.getStorageSync('randomName');
    if (random != '' && random.length > 0) {
      that.setData({
        randomName: random[0].name
      })
      wx.setStorageSync('randomName', random.splice(1));
      return;
    }
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
  //获取自定义的地区
  getReadyInfo() {
    var that = this
    //获取省份信息
    wx.request({
      url: app.globalData.base_url + 'wx/wish/public/getAllProvincial',
      method: 'POST',
      header: app.globalData.header,
      data: {},
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

  //许愿类型模态框
  showModal(e) {

    this.setData({
      modalName: e.currentTarget.dataset.target,
      textaStatus: true,
      btnstatus: true,
      tyepIndex: e.currentTarget.dataset.index
    })

  },
  //达成心愿模态框
  showModalPayment(e) {
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
  //增加一个空类型
  insert: function() {
    let info = this.data.info;
    if (info.length < 6) {
      info.push(new Detail());
      this.setData({
        info: info
      });
    }
  },
  //选择许愿类型
  chooseType(e) {
    var arr = []
    arr.push(e.currentTarget.dataset.item)
    if (this.data.checkboxStatus) {
      this.setData({
        checkboxStatus: true
      })
    } else {
      this.setData({
        checkboxStatus: true
      })
    }
    this.setData({
      activ: e.currentTarget.dataset.item.id,
      typearr: arr,
      checkboxStatus: !this.data.checkboxStatus,
    })
  },
  //失焦获取input的值
  getValue(e) {
    var arr = [{
      wishName: e.detail.value,
      id: 0,
      type: 2

    }]
    this.setData({
      typearr: arr
    })
  },

  //获取心愿内容
  wishAInput(e) {
    var textVal = e.detail.value
    var infoObj = this.data.info[e.currentTarget.dataset.index];
    infoObj.wishContent = textVal;


  },

  //确认心愿类型提交
  subWish() {
    const myinfo = this.data.info
    myinfo[this.data.tyepIndex].wishName = this.data.typearr[0].wishName
    myinfo[this.data.tyepIndex].useNum = this.data.typearr[0].useNum
    myinfo[this.data.tyepIndex].chooseType = this.data.typearr[0].type
    myinfo[this.data.tyepIndex].icon = app.globalData.fileServer + '/' + this.data.typearr[0].icon
    myinfo[this.data.tyepIndex].id = this.data.typearr[0].id

    this.setData({
      info: myinfo,
      modalName: null,
      btnstatus: false,
      textaStatus: ''
    })
  },
  //删除心愿类型
  deleModal(e) {
    const delefo = this.data.info
    if (e.currentTarget.dataset.index >= 1) {
      delefo.splice(e.currentTarget.dataset.index, 1)
    }
    this.setData({
      info: delefo
    })
  },
  //单选按钮状态
  checkbox() {
    this.setData({
      checkboxStatus: !this.data.checkboxStatus,
      activ: 100
    })
  },
  //金额单选按钮
  paymentCheckbox() {
    this.setData({
      checkboxPaymentStatus: !this.data.checkboxPaymentStatus,
      activ: 100
    })
  },
  //选择金额，将这个金额对象储存到一个数组
  choosePayment(e) {
    this.setData({
      checkboxPaymentStatus: true
    })
    var arr = []
    arr.push(e.currentTarget.dataset.item)
    this.setData({
      activ: e.currentTarget.dataset.item.id,
      prizarr: arr,
      checkboxPaymentStatus: !this.data.checkboxPaymentStatus,
      withPriceIntervalId: e.currentTarget.dataset.item.id
    })
  },
  //失焦获取input自定义金额
  getValue1(e) {
    var arr = [{
      customPaymentYuan: e.detail.value,
      id:0
    }]
    this.setData({
      prizarr: arr,
      withPriceIntervalId: 0,
      customPaymentYuan: e.detail.value
    })
  },
  //确认金额
  subPriz() {
    const myinfo = this.data.prizarr
    var wishCardNum = 0;
    if (myinfo != null && myinfo[0].wishCardNum != null && this.data.stuCard) {
      wishCardNum = myinfo[0].wishCardNum;
    }
    this.setData({
      prizinfo: myinfo,
      modalName1: null,
      btnstatus: false,
      textaStatus: '',
      wishCardNum: wishCardNum
    })
  },


  //获取心愿类型
  getWishType() {
    var that = this
    wx.request({
      url: app.globalData.base_url + '/wx/wish/public/getWishType',
      method: 'get',
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            typeData: res.data.datas
          })
        }
      }
    })
  },
  //获取达成心愿的金额区间
  getWishPriceList() {
    var that = this
    wx.request({
      url: app.globalData.base_url + '/wishDetail/getWishPriceList',
      method: 'post',
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            prizeData: res.data.datas
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
    this.getWishType()
    this.getWishPriceList()
    this.disTime()
    this.getReadyInfo()
    this.getCardNum()
    //默认署名为昵称
    var user = app.globalData.userInfo;
    if (user != null) {
      this.setData({
        randomName: user.nickName
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