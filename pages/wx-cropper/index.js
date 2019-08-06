const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    src: '',
    width: 750, //宽度
    height:320, //高度
    // width: 900, //宽度
    // height: 383, //高度
    max_width: 400,
    max_height: 400,
    disable_rotate: true, //是否禁用旋转
    disable_ratio: true, //锁定比例
    limit_move: true, //是否限制移动
  },
  onLoad: function(options) {
    this.cropper = this.selectComponent("#image-cropper");
    this.initImg();
    //this.cropper.upload();//上传图片
  },
  cropperload(e) {},
  loadimage(e) {
    wx.hideLoading();
    this.cropper.imgReset();
  },
  initImg() {
    let that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];   //上一个页面
    const tempFilePaths = prevPage.data.tempImg;
    that.cropper.imgReset();
    that.setData({
      src: tempFilePaths
    });
  },
  //裁剪图片后上传
  clickcut() {
    var that = this;
    that.cropper.getImg(function(e) {
      var tempAddr = e.url;
      wx.uploadFile({
        url: app.globalData.fileServer + 'fileUpload',
        filePath: tempAddr,
        name: 'file',
        success(res) {
          const dataObj = JSON.parse(res.data);
          if (dataObj.code == '200') {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];   //上一个页面
            prevPage.setData({
              theme_addr: dataObj.datas,
              imgBoolean: false,
              bnnerSrc: app.globalData.fileServer + dataObj.datas
            })
            wx.navigateBack({
              delta: 1
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
    })

  },
  upload() {

  },
  setWidth(e) {
    this.setData({
      width: e.detail.value < 10 ? 10 : e.detail.value
    });
    this.setData({
      cut_left: this.cropper.data.cut_left
    });
  },
  setHeight(e) {
    this.setData({
      height: e.detail.value < 10 ? 10 : e.detail.value
    });
    this.setData({
      cut_top: this.cropper.data.cut_top
    });
  },
  switchChangeDisableRatio(e) {
    //设置宽度之后使剪裁框居中
    this.setData({
      disable_ratio: e.detail.value
    });
  },
  setCutTop(e) {
    this.setData({
      cut_top: e.detail.value
    });
    this.setData({
      cut_top: this.cropper.data.cut_top
    });
  },
  setCutLeft(e) {
    this.setData({
      cut_left: e.detail.value
    });
    this.setData({
      cut_left: this.cropper.data.cut_left
    });
  },
  switchChangeDisableRotate(e) {
    //开启旋转的同时不限制移动
    if (!e.detail.value) {
      this.setData({
        limit_move: false,
        disable_rotate: e.detail.value
      });
    } else {
      this.setData({
        disable_rotate: e.detail.value
      });
    }
  },
  switchChangeLimitMove(e) {
    //限制移动的同时锁定旋转
    if (e.detail.value) {
      this.setData({
        disable_rotate: true
      });
    }
    this.cropper.setLimitMove(e.detail.value);
  },
  switchChangeDisableWidth(e) {
    this.setData({
      disable_width: e.detail.value
    });
  },
  switchChangeDisableHeight(e) {
    this.setData({
      disable_height: e.detail.value
    });
  },
  submit() {
    this.cropper.getImg((obj) => {
      app.globalData.imgSrc = obj.url;
      wx.navigateBack({
        delta: -1
      })
    });
  },
  rotate() {
    //在用户旋转的基础上旋转90°
    this.cropper.setAngle(this.cropper.data.angle += 90);
  },
  top() {
    this.data.top = setInterval(() => {
      this.cropper.setTransform({
        y: -3
      });
    }, 1000 / 60)
  },
  bottom() {
    this.data.bottom = setInterval(() => {
      this.cropper.setTransform({
        y: 3
      });
    }, 1000 / 60)
  },
  left() {
    this.data.left = setInterval(() => {
      this.cropper.setTransform({
        x: -3
      });
    }, 1000 / 60)
  },
  right() {
    this.data.right = setInterval(() => {
      this.cropper.setTransform({
        x: 3
      });
    }, 1000 / 60)
  },
  narrow() {
    this.data.narrow = setInterval(() => {
      this.cropper.setTransform({
        scale: -0.02
      });
    }, 1000 / 60)
  },
  enlarge() {
    this.data.enlarge = setInterval(() => {
      this.cropper.setTransform({
        scale: 0.02
      });
    }, 1000 / 60)
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },
})