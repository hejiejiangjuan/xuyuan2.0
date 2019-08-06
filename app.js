const ald = require('./utils/ald-stat.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
        var system = res.system
        var sys = 'iOS'
        if (system.indexOf(sys)>=0) {
          that.globalData.phone ="iOS"
        }else{
          that.globalData.phone = "Ad"
        }
      },
    })

    this.util = require('./utils/util.js');
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs) 
    // 判断用户是否已存在，存在直接登录后台
    // var p = this.myLogin();
    // console.log(p)
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },

  myLogin() {
    var that = this;
    var p = new Promise(function (resolve, reject) {
      var storageOpenId = wx.getStorageSync('openId');
      var userInfoStr = wx.getStorageSync('userInfoStr');
      if (storageOpenId && userInfoStr) {
        wx.request({
          url: that.globalData.base_url + 'wxUser/dologin',
          method: 'POST',
          data: {
            userInfo: encodeURI(userInfoStr),
            openId: storageOpenId
          },
          success(res) {
            that.globalData.openId = storageOpenId;
            that.globalData.userInfo = res.data.datas.wxUser;
            that.globalData.sessionId = res.data.datas.sessionId;
            that.globalData.header = {
              'content-type': 'application/json',
              'Cookie': 'JSESSIONID=' + that.globalData.sessionId,
              'openid': storageOpenId
            }
            resolve(that.globalData.header)
          }
        })
      } else {
        // 从微信获取数据登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            var code = res.code;
            wx.request({
              url: that.globalData.base_url + 'wxUser/getOpenId',
              method: 'POST',
              data: {
                code: code,
                appid: that.globalData.appid
              },
              success(res) {
                that.globalData.openId = res.data.datas.openId;
                wx.setStorageSync('openId', that.globalData.openId);
                that.globalData.sessionId = res.data.datas.sessionId;
                that.globalData.sessionKey = res.data.datas.sessionKey;
                that.globalData.header = {
                  'content-type': 'application/json',
                  'Cookie': 'JSESSIONID=' + that.globalData.sessionId,
                  'openid': that.globalData.openId
                }
                resolve(that.mygetUserInfo())
              }
            })
          }
        })
      }
    })
    return p;
  },

  mygetUserInfo() {
    var that = this;
    // 获取用户信息
    var p = new Promise(function (resolve, reject) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                // that.globalData.userInfo = res.userInfo
                var userInfoStr = res.rawData;
                wx.request({
                  url: that.globalData.base_url + 'wxUser/dologin',
                  method: 'POST',
                  data: {
                    userInfo: encodeURI(res.rawData),
                    openId: that.globalData.openId,
                    appid: that.globalData.appid,
                    encryptedData: res.encryptedData,
                    sessionKey: that.globalData.sessionKey,
                    iv:res.iv
                  },
                  header: that.globalData.header,
                  success(res) {
                    that.globalData.userInfo = res.data.datas.wxUser;
                    wx.setStorageSync('userInfoStr', userInfoStr);
                    resolve('获取用户信息成功')
                  }
                })
              }
            })
          } else {
            var pages = getCurrentPages()    //获取加载的页面
            var currentPage = pages[pages.length - 1]    //获取当前页面的对象

            currentPage.setData({
              showModal: !currentPage.data.showModal
            })
            wx.hideTabBar({
              fail: function () {
                setTimeout(function () {
                  wx.hideTabBar()
                }, 0)
              }
            });
            resolve('unauth')//未授权
          }
        }
      })
    })
    return p
  },
  //获取用户最新头像等信息，仅在已授权后用于关注公众号使用
  addNewUserInfo() {
    var that = this;
    // 获取用户信息
    var p = new Promise(function (resolve, reject) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var code = res.code;
          wx.request({
            url: that.globalData.base_url + 'wxUser/getOpenId',
            method: 'POST',
            data: {
              code: code,
              appid: that.globalData.appid
            },
            success(res) {
              that.globalData.sessionKey = res.data.datas.sessionKey;
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        var userInfoStr = res.rawData;
                        wx.request({
                          url: that.globalData.base_url + 'wxUser/addUserInfo',
                          method: 'POST',
                          data: {
                            sessionKey: that.globalData.sessionKey,
                            encryptedData: res.encryptedData,
                            iv: res.iv
                          },
                          header: that.globalData.header,
                          success(res) {
                          }
                        })
                      }
                    })
                    resolve('ok');
                  } else {
                    //用户未授权
                    var pages = getCurrentPages()    //获取加载的页面
                    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
                    currentPage.setData({
                      showModal: !currentPage.data.showModal
                    })
                    wx.hideTabBar({
                      fail: function () {
                        setTimeout(function () {
                          wx.hideTabBar()
                        }, 0)
                      }
                    });
                    resolve('fail');
                  }
                }
              })
            }
          })
        }
      })
    });
    return p;
  },
  /** 替换emoji表情 */
  filterEmoji(name) {
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
  },
  //替换换行
  replaceNewLine(content) {
    return content.split('\n').join('&hc');
  },
  //还原换行
  restoreNewLine(content) {
    return content.split('&hc').join('\n');
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  //截取地址参数值
  GetUrlParame(url,parameName) {
    /// 获取地址栏指定参数的值
    /// <param name="parameName">参数名</param>
    // 获取url中跟在问号后面的部分
    var parames = url;
    parames = parames.substring(parames.indexOf('?'));
    // 检测参数是否存在
    if (parames.indexOf(parameName) > -1) {
      var parameValue = ''
      parameValue = parames.substring(parames.indexOf(parameName), parames.length)
      // 检测后面是否还有参数
      if (parameValue.indexOf('&') > -1) {
        // 去除后面多余的参数, 得到最终 parameName=parameValue 形式的值
        parameValue = parameValue.substring(0, parameValue.indexOf('&'))
      }
      // 去掉参数名, 得到最终纯值字符串
      parameValue = parameValue.replace(parameName + '=', '')
      return parameValue
    }
  },
  globalData: {
    base_url: "https://wish.heidouinfo.com/",
    fileServer: "https://file.heidouinfo.com/",
    appid: 'wxa142de562c1bcb7d',
    header: null,
    sessionId: null,
    openId: null,
    unionId:null,
    userInfo: null,
    systemInfo: null,//系统型号
    //用于后台解密用户unionid
    sessionKey:null,
    phone:null,//手机系统
  }
})