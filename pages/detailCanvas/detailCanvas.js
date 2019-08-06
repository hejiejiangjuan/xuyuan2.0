// pages/detailCanvas/detailCanvas.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: '',
    canvasHeight: '',
    info: {},
    id: '',
    fileServer: app.globalData.fileServer,
  },
  detailCanvas() {
    //画布做适配
    var that = this
    var Rpx
    wx.getSystemInfo({
      success: function(res) {
        Rpx = res.windowWidth / 375;
        that.setData({
          canvasWidth: 260 * Rpx,
          canvasHeight: 440 * Rpx,
          titleHeight: 18
        })
      },
    })
    //开始画canvas
    //处理数据
    var info = this.data.info;
    var wishList = info.activity_wish_list[0];
    var fileServer = this.data.fileServer;
    var ctx = wx.createCanvasContext("detalCanvas")
    var bgSrc = 'https://file.heidouinfo.com/default/wish/wish_moon3.png'
    //上架logo
    var chantsSrc = info.logo
    var userSrc = info.curUserAvatar;
    //主题图片
    var goodsSrc = fileServer + info.themeAddr;
    //心愿icon
    var iconSrc = fileServer + wishList.icon
    //二维码
    var codeSrc = 'http://img5.imgtn.bdimg.com/it/u=2353659726,351998123&fm=26&gp=0.jpg'

    if (info.has_join == 1 && info.needHelp == 1) {
      codeSrc = fileServer + info.helpCodeAddr;
    } else {
      codeSrc = fileServer + info.codeAddr;
    }
    //活动主题
    var activetitle = info.activityTheme;
    //开奖方式
    var openDescribe = '';
    if (info.openPrizeCon == 1) {
      openDescribe = info.openDescribe + '自动开奖';
    } else if (info.openPrizeCon == 2) {
      openDescribe = '满' + info.openDescribe + '人自动开奖';
    } else {
      openDescribe = '发起者手动开奖';
    }
    //心愿礼单
    var prizeName = wishList.prizeName;
    //礼单个数
    var prizeNum = '×' + wishList.prizeNum;

    var that = this
    //画背景图片
    wx.downloadFile({
      url: bgSrc,
      success(res) {
        if (res.tempFilePath) {
          var bgImg = res.tempFilePath
          ctx.drawImage(bgImg, 0, 0, 260 * Rpx, 440 * Rpx)
          // ctx.draw()
          //画商品图片
          wx.downloadFile({
            url: goodsSrc,
            success(res) {
              if (res.tempFilePath) {
                var goodsImg = res.tempFilePath
                ctx.drawImage(goodsImg, 20 * Rpx, 115 * Rpx, 220 * Rpx, 100 * Rpx)
                //画许下的愿望
                ctx.setFillStyle('#F4EFFA')
                ctx.fillRect(20 * Rpx, 300 * Rpx, 220 * Rpx, 20 * Rpx)
                ctx.fill()
                ctx.setFontSize(10 * Rpx)
                ctx.setFillStyle('#999999')
                ctx.fillText(prizeName, 40 * Rpx, 314 * Rpx)
                ctx.setFontSize(10 * Rpx)
                ctx.setFillStyle('#333333')
                ctx.fillText(prizeNum, 215 * Rpx, 314 * Rpx)
                //画二维码
                wx.downloadFile({
                  url: codeSrc,
                  success(res) {
                    if (res.statusCode === 200) {
                      var codeImg = res.tempFilePath
                      ctx.drawImage(codeImg, 175 * Rpx, 340 * Rpx, 60 * Rpx, 60 * Rpx)
                      //画icon
                      wx.downloadFile({
                        url: iconSrc,
                        success(res) {
                          if (res.statusCode === 200) {
                            var iconImg = res.tempFilePath
                            ctx.drawImage(iconImg, 25 * Rpx, 305 * Rpx, 10 * Rpx, 10 * Rpx)

                            // 画商家log
                            wx.downloadFile({
                              url: chantsSrc,
                              success(res) {
                                if (res.statusCode === 200) {

                                  //画活动标题
                                  ctx.setFontSize(14 * Rpx)
                                  ctx.setFillStyle('#333333')
                                  that.drawText(ctx, activetitle, 20 * Rpx, 235 * Rpx, 14 * Rpx, 190 * Rpx, 14 * Rpx)
                                  //画开奖方式
                                  ctx.setFontSize(10 * Rpx)
                                  ctx.setFillStyle('#FF3C75')
                                  ctx.fillText(openDescribe, 20 * Rpx, 270 * Rpx)

                                  //画心愿礼单
                                  ctx.setFontSize(10 * Rpx)
                                  ctx.setFillStyle('#333333')
                                  ctx.fillText('心愿礼单：', 20 * Rpx, 290 * Rpx)
                                  //画心愿礼单
                                  ctx.setFontSize(10 * Rpx)
                                  ctx.setFillStyle('#999999')
                                  ctx.fillText('更多心愿礼单识别下方小程序码查看', 82 * Rpx, 290 * Rpx)

                                  //画用户姓名
                                  ctx.setFontSize(13 * Rpx)
                                  ctx.setFillStyle('#666666')
                                  ctx.fillText(info.curUserNickName, 55 * Rpx, 355 * Rpx)

                                  ctx.setFontSize(10 * Rpx)
                                  ctx.setFillStyle('#999999')
                                  ctx.fillText('邀请您一起参与活动', 55 * Rpx, 370 * Rpx)
                                  //画参与下程序码的文字
                                  ctx.setFontSize(11 * Rpx)
                                  ctx.setFillStyle('#FF3C75')
                                  ctx.fillText('识别小程序码参与活动>>', 20 * Rpx, 395 * Rpx)

                                  //画商家名字
                                  ctx.setFontSize(13 * Rpx)
                                  ctx.setFillStyle('#333333')
                                  ctx.setTextAlign('center')
                                  ctx.fillText(info.miniName, 260 * Rpx / 2, 90 * Rpx)

                                  ctx.setFontSize(11 * Rpx)
                                  ctx.setFillStyle('#999999')
                                  ctx.setTextAlign('center')
                                  ctx.fillText('发布了一个许愿活动', 260 * Rpx / 2, 105 * Rpx)

                                  //画商家头像
                                  var chantImg = res.tempFilePath
                                  ctx.arc(130 * Rpx, 50 * Rpx, 25 * Rpx, 0, 2 * Math.PI)
                                  // ctx.setFillStyle('red')
                                  // ctx.fill()
                                  // ctx.clip()
                                  ctx.restore()
                                  //画用户头像
                                  wx.downloadFile({
                                    url: userSrc,
                                    success(res) {
                                      if (res.statusCode === 200) {

                                        var userImg = res.tempFilePath
                                        ctx.arc(35 * Rpx, 360 * Rpx, 15 * Rpx, 0, 2 * Math.PI)
                                        // ctx.setFillStyle('red')
                                        // ctx.fill()
                                        ctx.clip()
                                        ctx.drawImage(userImg, 20 * Rpx, 345 * Rpx, 30 * Rpx, 30 * Rpx)
                                        ctx.drawImage(chantImg, 105 * Rpx, 25 * Rpx, 50 * Rpx, 50 * Rpx)
                                        ctx.draw()
                                        wx.hideLoading()
                                      }
                                    }
                                  })
                                }
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })

        }
      }
    })

  },


  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、标题高度 6、文本的宽度 7、字体大小
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, fontSize) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += fontSize + 5; //为字体的高度(行间距)
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += fontSize;
        this.setData({
          titleHeight: titleHeight
        })
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    // titleHeight = titleHeight + 10;
    return titleHeight
  },
  //返回首页
  backFirst() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //保存图片
  saveImg() {
    wx.canvasToTempFilePath({
      canvasId: 'detalCanvas',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
        wx.showLoading({
          title: '保存至手机相册',
          // mask:true
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 400)
      }
    }, this)
  },
  /**
   *
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.setData({
      id: id
    });
    this.getActivityDetailById();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //初始化详情页数据
  getActivityDetailById() {
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wx/wish/activity/getActivityDetailById',
      header: app.globalData.header,
      method: 'post',
      data: {
        activityId: that.data.id
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            info: res.data.datas
          })
          that.detailCanvas()
          wx.showLoading({
            title: '请稍后',
            mask: true
          });
        }
      }
    })
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