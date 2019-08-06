// pages/wishSuccess/wishSuccess.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: '',
    canvasHeight: '',
    info: {},
    id: ''
  },
  myCanvas() {
    //画布做适配
    var that = this
    var Rpx
    wx.getSystemInfo({
      success: function (res) {
        Rpx = res.windowWidth / 375;
        that.setData({
          canvasWidth: 230 * Rpx,
          canvasHeight: 410 * Rpx,
          titleHeight: 18
        })
      },
    })
    //开始画
    var info = that.data.info;
    var context = wx.createCanvasContext("firstCanvas")
    var bgSrc = 'https://file.heidouinfo.com/default/wish/wish_moon.png'
    var userSrc = info.wishInfo.imgAddr;
    var codeSrc = info.qrcode;
    //画背景图
    wx.downloadFile({ //通过这个方法将图片地址保存本地才能储存
      url: bgSrc,
      success(res) {
        if (res.statusCode === 200) {
          var myImgSrc = res.tempFilePath
          context.drawImage(myImgSrc, 0, 0, 230 * Rpx, 410 * Rpx)
          //画二维码
          wx.downloadFile({
            url: codeSrc,
            success(res) {
              if (res.statusCode === 200) {
                var myCodeSrc = res.tempFilePath
                context.drawImage(myCodeSrc, 160 * Rpx, 350 * Rpx, 50 * Rpx, 50 * Rpx)

                //画头像
                wx.downloadFile({ //通过这个方法将图片地址保存本地才能储存
                  url: userSrc,
                  success(res) {
                    if (res.statusCode === 200) {
                      //画名字
                      context.setFontSize(16 * Rpx)
                      context.setFillStyle('#ffffff')
                      context.fillText(info.wishInfo.nickName, 70 * Rpx, 85 * Rpx)
                      //画文字
                      context.setFontSize(8 * Rpx)
                      context.setFillStyle('#ffffff')
                      context.fillText('刚刚许下了个心愿，快来帮我实现吧~', 20 * Rpx, 120 * Rpx)
                      //画心愿类型
                      // context.setFillStyle('white')
                      // context.fillRect(20 * Rpx, 130 * Rpx, 195 * Rpx, 20 * Rpx)
                      // context.fill()
                      var wishListStr = info.wishInfo.wishListStr;
                      if (wishListStr != null) {
                        var heights = 145 * Rpx;
                        var oneObj = wishListStr[0];
                        context.setFontSize(11 * Rpx)
                        context.setFillStyle('#7436C1')
                        // context.fillText(oneObj.wishContent, 22 * Rpx, 145 * Rpx)
                        var content = oneObj.wishContent;
                        if (content.length > 15) {
                          content = content.substring(0,14) + '...';
                        }
                        that.drawText(context, content, 22 * Rpx, heights, 11 * Rpx, 180 * Rpx, 11 * Rpx)
                      }

                      // 背后的故事
                      context.setFontSize(8 * Rpx)
                      context.setFillStyle('#FFFEFE')
                      context.fillText('背后的故事', 22 * Rpx, 170 * Rpx)

                      var strText = info.wishInfo.story;
                      context.setFontSize(11 * Rpx)
                      context.setFillStyle('#FFFEFE')
                      that.drawText(context, strText, 22 * Rpx, 190 * Rpx, 11 * Rpx, 180 * Rpx, 11 * Rpx)
                      
                      //白色部分的文字
                      context.setFontSize(10 * Rpx)
                      context.setFillStyle('#999999')
                      context.fillText('来自【许愿日历】', 22 * Rpx, 365 * Rpx)
                      context.setFontSize(10 * Rpx)
                      context.setFillStyle('#FF3C75')
                      context.fillText('识别小程序码许心愿>>', 22 * Rpx, 385 * Rpx)

                      var userImgSrc = res.tempFilePath
                      context.arc(40 * Rpx, 80 * Rpx, 20 * Rpx, 0, 2 * Math.PI)
                      // context.setFillStyle('red')
                      // context.fill()
                      context.clip()
                      context.drawImage(userImgSrc, 20 * Rpx, 60 * Rpx, 40 * Rpx, 40 * Rpx)
                      context.draw()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    });
    this.getWishShareInfo();

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
      canvasId: 'firstCanvas',
      success(res) {
        wx.showLoading({
          title: '保存至手机相册',
          // mask:true
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 400)
      }
    }, this)
  },
  //获取心愿分享数据接口
  getWishShareInfo() {
    //随机昵称
    var that = this
    wx.request({
      url: app.globalData.base_url + 'wishDetail/getWishShareInfo',
      method: 'POST',
      header: app.globalData.header,
      data: {
        id: that.data.id
      },
      success(res) {
        const data = res.data;
        if (data.code == 200) {
          that.setData({
            info: data.datas
          })
          that.myCanvas()
          wx.showLoading({
            title: '请稍后',
            mask: true
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})