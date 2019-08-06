var app = getApp();
Page({
  data: {
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '开始输入...',
    _focus: false
  },
  //保存数据
  saveEditor() {
    this.editorCtx.getContents({
      success : function (e) {
        var  pages  =  getCurrentPages();
        var  prevPage  =  pages[pages.length  -  2];  //上一个页面
        prevPage.setData({ 
          detail_content: e.html
        })
        
        prevPage.onEditorReady()
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    wx.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: console.log
    })
  },
  //初始化
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      //获取上个页面的值
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var detail_content = prevPage.data.detail_content;
      if (detail_content != '') {
        //赋值
        that.editorCtx.setContents({
          html: detail_content,
          success: function () {
          }
        })
      }
    }).exec()
    
  },

  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.fileServer + 'fileUpload', 
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = res.data
            const dataObj = JSON.parse(data);
            if (dataObj.code == 200) {
              that.editorCtx.insertImage({
                src: app.globalData.fileServer + dataObj.datas,
                data: {
                  id: 'abcd',
                  role: 'god'
                },
                success: function () {
                }
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



        
      }
    })
  }
})
