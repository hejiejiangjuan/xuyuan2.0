// pages/embedded/embedded.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: '',
    canvasHeight: '',
    activeId:"",
    activeData:{},
    titleHeight:8
  },

  //canvas
  publicCanvas() {
    //画布做适配
    var that = this
    var Rpx
    wx.getSystemInfo({
      success: function(res) {
        Rpx = res.windowWidth / 375;
        that.setData({
          canvasWidth: 320 * Rpx,
          canvasHeight: 320 * Rpx,
        })
      },
    })
    //开始画图
    var publicSrc = 'https://file.heidouinfo.com/default/wish/wish_white.png'
    var actveSrc = app.globalData.fileServer + that.data.activeData.themeAddr
    var btnSrc = 'https://file.heidouinfo.com/default/wish/wish_button.png'
    var ctx = wx.createCanvasContext("publicCanvas")
    wx.downloadFile({
      url: publicSrc,
      success(res) {
        if (res.statusCode === 200) {
          var publicBg = res.tempFilePath
          ctx.drawImage(publicBg, 0 * Rpx, 0 * Rpx, 320 * Rpx, 320 * Rpx)
          //画按钮图片
          wx.downloadFile({
            url: btnSrc,
            success(res) {
              if (res.statusCode === 200) {
                var actveImg = res.tempFilePath
                ctx.drawImage(actveImg, 200 * Rpx, 260 * Rpx, 110 * Rpx, 65 * Rpx)
                //画活动图片
                wx.downloadFile({
                  url: actveSrc,
                  success(res) {
                    if (res.statusCode === 200) {
                      var actveImg = res.tempFilePath
                      ctx.drawImage(actveImg, 20 * Rpx, 20 * Rpx, 280 * Rpx, 140 * Rpx)
                      //画标题
                      ctx.setFontSize(16 * Rpx)
                      ctx.setFillStyle("#333333")
                      // ctx.fillText("that.data.activeData.activityTheme", 20 * Rpx, 185 * Rpx)
                      that.drawText(ctx, that.data.activeData.activityTheme, 20 * Rpx, 185 * Rpx, 16 * Rpx, 280 * Rpx, 16 * Rpx)

                      //画活动说明
                      // var actveText = '活动说明还可获得了爱上大理送到哪开始淡蓝色的那快了单身快乐但是'
                      ctx.setFontSize(14 * Rpx)
                      ctx.setFillStyle("#7436C1")
                      that.drawText(ctx, that.data.activeData.creativityExplain, 20 * Rpx, 215 * Rpx+that.data.titleHeight, 16 * Rpx, 280 * Rpx, 14 * Rpx)
                      //画开奖方式
                      if (that.data.activeData.openPrizeCon == 1) {
                        //  "自动"
                        ctx.setFontSize(12 * Rpx)
                        ctx.setFillStyle("#FF3C75")
                        ctx.fillText(that.data.activeData.openDescribe+'自动开奖', 20 * Rpx, 290 * Rpx)
                       
                      } else if (that.data.activeData.openPrizeCon == 2) {
                        // "达到"
                        ctx.setFontSize(12 * Rpx)
                        ctx.setFillStyle("#FF3C75")
                        ctx.fillText("参与者达到"+that.data.activeData.openDescribe+"人开奖", 20 * Rpx, 290 * Rpx)

                      } else if (that.data.activeData.openPrizeCon == 3) {
                        //  "发起者手动"
                        ctx.setFontSize(12 * Rpx)
                        ctx.setFillStyle("#FF3C75")
                        ctx.fillText('发起者手动开奖', 20 * Rpx, 290 * Rpx)
                      }
                      
                      //画btn上的文字
                      ctx.setFontSize(12 * Rpx)
                      ctx.setFillStyle("#ffffff")
                      ctx.fillText('立即参加', 230 * Rpx, 290 * Rpx)
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
        titleHeight += fontSize-15;
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
  //复制AppId
  copyApp: function() {
    wx.setClipboardData({
      data: 'wxa142de562c1bcb7d',
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  //复制page
  copyPage: function() {
    wx.setClipboardData({
      data: 'pages/evenDetails/evenDetails?id='+this.data.activeId,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  },
  //保存图片
  saveImg: function() {
    wx.canvasToTempFilePath({
      canvasId: 'publicCanvas',
      success(res) {
        wx.showLoading({
          title: '已保存到相册',
          // mask: true
        });

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })

        setTimeout(function() {
          wx.hideLoading()
        }, 400)
      }
    }, this)
  },
  //初始化数据
  imitPage() {
    var that = this
    wx.request({
      url: app.globalData.base_url + '/wx/wish/activity/getDetailShare',
      method: "post",
      data: {
        activityId: that.data.activeId
        // that.data.activeId,
      },
      header: app.globalData.header,
      success(res) {
        if(res.data.code==200){
            that.setData({
              activeData:res.data.datas
            })
          that.publicCanvas()
          wx.showLoading({
            title: '请稍后',
            mask: true
          });
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页加载
   */
  onLoad: function(options) {
    this.setData({
      activeId: options.id
    })
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
    this.imitPage()
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