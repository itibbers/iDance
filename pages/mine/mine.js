// pages/mine/mine.js
var app = getApp()
Page({
  data: {
    userInfo: null
  },
  // 载入
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})