// pages/active/active.js
const app = getApp();
//构造心愿类型
function Detail(name, num, type, con) {
  this.wishName = name;
  this.useNum = num;
  this.chooseType = type;
  this.wishContent = "";
  this.checkBtn = false;
}
var time = false
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //以上是裁剪数据
    fileServer: app.globalData.fileServer,
    id: 1,
    date: '',
    isdate:'',
    date1: '选择',
    region: ['四川', '成都', '锦江区'],
    index: null,
    picker: ['不限', '男', '女'],
    imgList: [],
    shareSwitch: false, //是否允许分享
    drainageSwitch: false, //品牌开关
    fansSwitch: false, //粉丝开关
    cardSwitch: false, //心愿卡开关
    helpSwitch: false, //助力开关
    vipSwitch: false,
    chooseSelection: 0, //修改心愿的条件
    bnnerSrc: "", //bnner图片地址
    wishinfo: [{}], //（上传）渲染类型
    checkBtn: false,
    citys: [], //自定义地区信息
    multiIndex: [0, 0], //自定义地区信息
    selectArea: [], //自定义地区信息
    tempIndex: [0, 0], //自定义地区信息
    typearr: [], //选择的类型
    typeData: [], //获取的心愿类型
    imgBoolean: true,
    theme_addr: '', //上传的图片信息
    activity_theme: '', //上传主题活动标题
    creativity_explain: '', //上传创意说明
    digest: '', //上传摘要说明
    detail_content: [], //上传详情
    open_prize_con: 1, //上传的心愿条件(默认是0按时间)
    provincialId: '', //省id
    cityId: '', //市id
    open_describe: '', //开奖条件
    openNum: '', //开奖的人数
    phones: "", //上传的手机号码
    lead_explain: '', //引导文案
    public_command: '', //复制文案的值
    lead: 0, //是否是高级版（默认0低级）
    yanzhengcode: "", //返回的验证码
    returnPhone: '', //返回的电话
    prompt_msg: '', //上传关键字
    early_appoint_time: '', //最早关注时间
    wish_index: 0, //性别选择
    help_num: '', //助力人数
    public_id: '', //公众号id
    public_auth_id: "", //选择的授权公众号唯一标识id
    publicName: '', //授权传过里啊的名字
    mini_name: '', //商家名称
    logo: '',
    codeStatus: null,
    prizeNum: '', //奖品数量的value值
    cardNum: 0, //高级可用次数
    showModalStatus: false, //开奖时间框状态
    timeStatus: false, //最早关注时间状态
    mini_appid: "", //小程序id
    phone: "", //手机系统
    subBtnStatus:true,
    tempImg : '',
    msg:'',
    cover:"",//封面地址
  },
  //跳转到裁剪
  corpper() {
    wx.navigateTo({
      url: '../wx-cropper/index',
    })
  },
  //发布提交
  submitActive() {
    var that = this
    clearTimeout(time)
    time = setTimeout(() => {
        that.setData({
          subBtnStatus:false
        })
      const param = {}
      //判断如果实物虚拟按钮为空默认为实物
      for (var i = 0; i < that.data.wishinfo.length; i++) {
        if (that.data.wishinfo[i].prize_type == undefined) {
          that.data.wishinfo[i].prize_type = 1
        }
        if (!that.data.wishinfo[i].wishName) {
          wx.showToast({
            title: '选择许愿类型',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            subBtnStatus: true
          })
          return
        }
        if (that.data.wishinfo[i].prize_name == undefined) {
          wx.showToast({
            title: '输入奖品名称',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            subBtnStatus: true
          })
          return
        }
        if (that.data.wishinfo[i].prize_num == undefined) {
          wx.showToast({
            title: '输入奖品数量',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            subBtnStatus: true
          })
          return
        }
      }
      //主题不为空
      if (!that.data.activity_theme) {
        wx.showToast({
          title: '活动主题不能为空',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          subBtnStatus: true
        })
        return
      }
      //背景不为空
      // if (!that.data.theme_addr) {
      //   wx.showToast({
      //     title: '选择主题图片',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   that.setData({
      //     subBtnStatus: true
      //   })
      //   return
      // }
      //创意说明不为空
      if (!that.data.creativity_explain) {
        wx.showToast({
          title: '请填写创意说明',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          subBtnStatus: true
        })
        return
      }
      //活动摘要不为空
      // if (!that.data.digest) {
      //   wx.showToast({
      //     title: '请填写活动摘要',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return
      // }
      //活动详情不为空
      if (!that.data.detail_content) {
        wx.showToast({
          title: '请填写活动详情',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          subBtnStatus: true
        })
        return
      }
      //活动详情不为空
      if (!that.data.detail_content) {
        wx.showToast({
          title: '请填写活动详情',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          subBtnStatus: true
        })
        return
      }
      //手机号不为空
      if (!that.data.phones || this.data.phones != this.data.returnPhone) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          subBtnStatus: true
        })
        return
      }
      //匹配验证码
      if (!this.data.yanzhengcode || this.data.codeStatus1 == false) {
        wx.showToast({
          title: '验证码有误',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          subBtnStatus: true
        })
        return
      }
      //如果高级版按钮状态打开，品牌信息打开字段不能为空
      if (that.data.vipSwitch) {
        if (that.data.drainageSwitch) {
          if (!that.data.public_id) {
            wx.showToast({
              title: '请输入公众号Id',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }

          if (!that.data.mini_name) {
            wx.showToast({
              title: '请输入商家名称',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }
          if (!that.data.mini_appid) {
            wx.showToast({
              title: '请输入小程序ID',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }

          if (!that.data.logo) {
            wx.showToast({
              title: '请上传logo',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }
        }
      }
      //判断公总号粉丝参与
      if (that.data.vipSwitch) {
        if (that.data.fansSwitch) {
          if (!that.data.public_auth_id) {
            wx.showToast({
              title: '请授权公众号',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }
          if (!that.data.prompt_msg) {
            wx.showToast({
              title: '请输入关键字',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }
          if (that.data.timeStatus) {
            if (!that.data.early_appoint_time) {
              wx.showToast({
                title: '请输入最早关注时间',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                subBtnStatus: true
              })
              return
            }
          }
        }
      }


      //判断助力
      if (that.data.vipSwitch) {
        if (that.data.helpSwitch) {
          if (!that.data.help_num) {
            wx.showToast({
              title: '请输入助力人数',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              subBtnStatus: true
            })
            return
          }
        }
      }
      param.theme_addr = that.data.theme_addr ? that.data.theme_addr : that.data.cover
      param.activity_theme = that.data.activity_theme
      param.wish_List = that.data.wishinfo
          //活动详情判断
    if (that.data.vipSwitch) {
      param.detail_content = that.data.detail_content
    } else {
      param.detail_content = app.replaceNewLine(that.data.detail_content);
    }
      param.digest = that.data.digest
      param.creativity_explain = that.data.creativity_explain
      param.provincialId = that.data.provincialId ? that.data.provincialId : 0
      param.cityId = that.data.cityId ? that.data.cityId : 0
      param.open_prize_con = that.data.open_prize_con
      param.share = that.data.shareSwitch ? 1 : 0
      param.phone = that.data.phones
      param.lead_explain = that.data.lead_explain
      param.public_command = that.data.public_command
      //判断是否为高级版
      if (that.data.vipSwitch) { //高级版
        param.public_auth_id = that.data.public_auth_id
        param.help_num = that.data.help_num
        param.public_id = that.data.public_id
        param.logo = that.data.logo
        param.lead = 1
        param.mini_name = that.data.mini_name
        param.prompt_msg = that.data.prompt_msg
        param.wish_condition = that.data.wish_index
        param.early_appoint_time = that.data.timeStatus ? that.data.early_appoint_time : null
        param.guide = that.data.drainageSwitch ? 1 : 0
        param.only_fans = that.data.fansSwitch ? 1 : 0
        param.need_help = that.data.helpSwitch ? 1 : 0
        param.mini_appid = that.data.mini_appid
      } else {
        param.lead = 0
      }

      //判断心愿条件
      if (that.data.open_prize_con == 1) {
        if (!that.data.date) {
          wx.showToast({
            title: '请填开奖时间',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            subBtnStatus: true
          })
          return
        }
        param.open_describe = that.data.date

      } else if (that.data.open_prize_con == 2) {
        //开奖的人数
        if (!that.data.openNum) {
          wx.showToast({
            title: '请填开奖到达人数',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            subBtnStatus: true
          })
          return
        }
        param.open_describe = that.data.openNum
      }
      wx.showLoading({
        title: '正在提交数据',
      })
      wx.request({
        url: app.globalData.base_url + 'wx/wish/activity/addActivity',
        header: app.globalData.header,
        data: {
          activityObj: encodeURI(JSON.stringify(param))
        },
        method: 'POST',
        success(res) {
          const data = res.data;
          if (data.code == 200) {
            that.setData({
              //清空表单
              theme:'',
              prizeName:'',
              prizeNum:'',
              explain:'',
              digest:'',
              openNum:'',
              myphone:'',
              blurCode:'',
              thePublic:'',
              miniName:'',
              miniAppid:'',
              promptMsg:'',
              helpNumInput:'',
              leadExplain:'',
              publicCommand:'',
              codeStatus:null
            })
            that.setData({
              subBtnStatus: true
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateTo({
              url: '../evenDetails/evenDetails?id=' + res.data.datas,
            })
            
          } else {
            that.setData({
              subBtnStatus: true,
              modalName:"msgModal",
              msg: res.data.message
            })
            return
          }
          wx.hideLoading()
        }
      })

    }, 500)

  },

  //更换封面,获取图片信息
  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, //一张
      sourceType: ['album', 'camera'], //相册和相机
      sizeType: ['original', 'compressed'],
      success: function(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var format=['jpg','png']
          if (res.tempFilePaths[0].indexOf(format[0])>=0){
          } else if (res.tempFilePaths[0].indexOf(format[1]) >= 0){
          }else{
            wx.showToast({
              title: '请上传jpg或者png格式图片',
              icon:'none'
            })
            return
          }
        that.setData({
          tempImg: res.tempFilePaths[0],
        })
       //跳转到裁剪页
        wx.navigateTo({
          url : '../wx-cropper/index'
        })
        return
        
      },
    })
  },
  //活动主题的值
  ActivityThemeInput: function(e) {
    this.setData({
      activity_theme: e.detail.value
    })
  },
  //获取创意说明
  creativityExplainInput: function(e) {
    this.setData({
      creativity_explain: e.detail.value
    })
  },
  //获取摘要说明
  digestInput(e) {
    this.setData({
      digest: e.detail.value
    })
  },
  //奖品名称
  prizeName(e) {
    var typeIndex = e.currentTarget.dataset.index
    this.data.wishinfo[typeIndex].prize_name = e.detail.value
  },
  //获取奖品数量
  prizeNum(e) {
    var reg = /^[0-9]*$/
    if (!reg.test(e.detail.value)) {
      this.setData({
        prizeNum: ""
      })
      wx.showToast({
        title: '奖品数量请输入数字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var typeIndex = e.currentTarget.dataset.index
    this.data.wishinfo[typeIndex].prize_num = e.detail.value
  },
  //获取(普通版)活动详情
  activeDetail(e) {
    this.setData({
      detail_content: e.detail.value
    })
  },
  //获取小程序Id
  miniAppid(e) {
    this.setData({
      mini_appid: e.detail.value
    })
  },

  //获取手机号码
  phoneInput(e) {
    this.setData({
      phones: e.detail.value
    })
  },
  //获取验证码 
  huoquCode: function() {
    var _this = this
    var re = /^1(3|4|5|7|8)\d{9}$/;
    if (re.test(this.data.phones)) {
      wx.request({
        url: app.globalData.base_url + '/wx/wish/public/getPhoneCode',
        method: "get",
        header: app.globalData.header,
        data: {
          phone: this.data.phones
        },
        success(res) {
          if (res.data.code == 200) {
            _this.setData({
              codeStatus: 1,
              yanzhengcode: res.data.datas.code,
              returnPhone: res.data.datas.phone
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //验证验证码
  blurCode(e) {
    var code = e.detail.value
    if (code !== '' && code == this.data.yanzhengcode && this.data.phones == this.data.returnPhone) {
      this.setData({
        codeStatus: 2,
      })
    } else {
      this.setData({
        codeStatus: null,
      })
      wx.showToast({
        title: '验证码不匹配',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //获取关键字
  promptMsg(e) {
    this.setData({
      prompt_msg: e.detail.value
    })
  },
  //获取助力人数
  helpNumInput(e) {
    this.setData({
      help_num: e.detail.value
    })
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
  //是否选择最早关注时间
  timeStatus() {
    this.setData({
      timeStatus: !this.data.timeStatus
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
  //单选按钮状态
  checkbox() {
    this.setData({
      checkboxStatus: !this.data.checkboxStatus,
      activ: 100
    })
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
      wishName: e.detail.value
    }]
    this.setData({
      typearr: arr
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

  //确认心愿类型提交
  subWish() {
    const myinfo = this.data.wishinfo
    myinfo[this.data.tyepIndex].wishName = this.data.typearr[0].wishName
    myinfo[this.data.tyepIndex].useNum = this.data.typearr[0].useNum
    myinfo[this.data.tyepIndex].chooseType = this.data.typearr[0].tyep
    myinfo[this.data.tyepIndex].icon = this.data.typearr[0].icon
    myinfo[this.data.tyepIndex].id = this.data.typearr[0].id
    myinfo[this.data.tyepIndex].checkBtn = this.data.checkBtn
    this.setData({
      wishinfo: myinfo,
      modalName: null,
      btnstatus: false,
      textaStatus: '',
    })
  },
  //实物虚拟选择
  checkBtn(e) {
    var typeIndex = e.currentTarget.dataset.index
    this.setData({
      checkBtn: !this.data.checkBtn
    })
    var checkinfo = this.data.wishinfo


    if (this.checkBtn) {
      checkinfo[typeIndex].prize_type = 2
      checkinfo[typeIndex].checkBtn = this.data.checkBtn
      this.setData({
        wishinfo: checkinfo
      })
    } else {
      checkinfo[typeIndex].prize_type = 1
      checkinfo[typeIndex].checkBtn = this.data.checkBtn
      this.setData({
        wishinfo: checkinfo
      })

    }
  },

  // 修改开启心愿条件
  open() {
    var that = this
    wx.showActionSheet({
      itemList: ['按时间自动开奖', '按人数自动开奖', '手动开奖'],
      success: function(res) {
        that.setData({
          chooseSelection: res.tapIndex,
          open_prize_con: res.tapIndex + 1
        });
      }
    });
  },
  //获取开奖人数
  openNumInput(e) {
    this.setData({
      openNum: e.detail.value
    })
  },
  //获取公总号
  thePublic(e) {
    this.setData({
      public_id: e.detail.value
    })
  },
  //获取商家名称
  miniName(e) {
    this.setData({
      mini_name: e.detail.value
    })
  },
  //模态框
  // powerDrawer: function(e) {
  //   var currentStatu = e.currentTarget.dataset.statu;
  //   this.util(currentStatu)
  // },
  //开奖时间选择
  // DateChange(e) {
  //   console.log(e)
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },
  //开奖时间模态框
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  //选择时间
  util: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        if (this.data.isdate) {
          this.setData({
            showModalStatus: false
          });
        }
        // else {
        //   this.showToast('时间不能早于当前');
        // }
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },

  bindSelect: function(e) {
  },

  //最早关注时间
  ealeDateChange(e) {
    this.setData({
      date1: e.detail.value,
      early_appoint_time: new Date(e.detail.value).getTime()

    })
  },
  //禁用早与当前的时间
  // disTime() {
  //   var time = new Date()
  //   this.setData({
  //     tday: time.getDate(),
  //     tMonth: time.getMonth(),
  //     tYear: time.getFullYear(),
  //     // date: time.getFullYear() + '-' + parseInt(time.getMonth() + 1) + '-' + time.getDate(),
  //   })
  // },
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

  //引导文案的值
  leadExplain(e) {
    this.setData({
      lead_explain: e.detail.value
    })
  },
  //获取复制类容的值
  publicCommand(e) {
    this.setData({
      public_command: e.detail.value
    })

  },
  //性别选择
  PickerChange(e) {
    this.setData({
      index: e.detail.value,
      wish_index: e.detail.value
    })
  },
  //logo上传
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //logo图片选择
  chooselogo() {
    var that = this
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          that.setData({
            imgList: res.tempFilePaths
          })
        }
        wx.uploadFile({
          url: app.globalData.fileServer + 'fileUpload', // 仅为示例，非真实的接口地址
          filePath: that.data.imgList[0],
          name: 'file',
          success(res) {
            const data = res.data
            const dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
              that.setData({
                logo: dataObj.datas,
                logoBoolean: false
              });
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
  //删除logo
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  //增加一个空类型
  insert: function() {
    let info = this.data.wishinfo;
    if (info.length < 6) {
      info.push(new Detail());
      this.setData({
        wishinfo: info
      });
    }
  },
  //删除心愿类型
  deleModal(e) {
    const delefo = this.data.wishinfo
    if (e.currentTarget.dataset.index >= 1) {
      delefo.splice(e.currentTarget.dataset.index, 1)
    }
    this.setData({
      wishinfo: delefo
    })
  },

  //品牌开关
  switch2change(e) {
    this.setData({
      drainageSwitch: e.detail.value
    })
  },
  //允许粉丝参与开关
  switch3change(e) {
    this.setData({
      fansSwitch: e.detail.value
    })
  },
  //心愿卡开关
  switch4change(e) {
    this.setData({
      cardSwitch: e.detail.value
    })
  },
  //助力卡开关
  switch5change(e) {
    this.setData({
      helpSwitch: e.detail.value,
      shareSwitch: e.detail.value,
    })
  },
  //是否允许分享开关
  switch1change(e) {
    this.setData({
      shareSwitch: e.detail.value
    })
  },
  //高级版开关,如果有次数直接使用，如果没有去购买页
  viPBtn() {
    if (this.data.cardNum > 0) {
      this.setData({
        vipSwitch: true,
        detail_content: []
      })
    } else {
        wx.navigateTo({
          url: '../vipCheck/vipCheck',
        })
    }
  },
  //隐藏系统模态框
  hideGiveModal() {
    this.setData({
      modalName: 'null'
    })
  },
  //切换普通版
  generalBtn() {
    this.setData({
      vipSwitch: false,
      detail_content: []
    })
  },
  //跳转富文本
  goRichTextDemo() {
    
    wx.navigateTo({
      url: '../richtext/richtext',
    })
  },
  
  //初始化富文本
  onEditorReady () {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      that.changeEditorContent();
    }).exec()
  },
  //改变富文本内容
  changeEditorContent () {
    var that = this;
    if (that.data.detail_content != '') {
      that.editorCtx.setContents({
        html: that.data.detail_content,
        success: function () {
        }
      })
    }
  },
  //获取高级版次数
  getLeadNum() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getLeadNum',
      method: 'post',
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            cardNum: res.data.datas
          })
        }
      }
    })
  },
  //跳转授权页
  authorization() {
    wx.navigateTo({
      url: '../authorization/authorization',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options!=undefined&&options.vipSwitch) {
      this.setData({
        vipSwitch: true
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getWishType()
    this.getReadyInfo()
    // this.disTime()
    this.getLeadNum()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //判断手机系统
    if (app.globalData.phone == "iOS") {
      this.setData({
        phone: 'iOS'
      })
    } else {
      this.setData({
        phone: 'Ad'
      })
    }
    this.getImg()
  },
  //获取封面图片
  getImg(){
    var that = this
    wx.request({
      url: app.globalData.base_url + 'personal/getAboutUs',
      method: 'post',
      header: app.globalData.header,
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            cover: res.data.datas.activity.titleValue
          })
        }
      }
    })
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