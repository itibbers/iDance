//index.js
var config = require('../../config')
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    PIN: null,
    loading: false,
    btnName: '创建群组'
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
      that.checkRoom()
    })
    // 获取当前位置
    app.getLocation()
    // 检查房间
    // this.checkRoom()
  },
  // 加载完成
  onReady: function () {
  },
  // 页面显示
  onShow: function () {
    // 检查房间
    this.checkRoom()
  },

  //事件处理函数
  // 
  checkRoom: function () {
    console.log('检查是否存在房间')
    var that = this
    app.checkRoom(function () {
      that.setData({
        btnName: '我的群组'
      })
    })
  },
  createRoom: function (e) {
    console.log('创建房间')
    var that = this
    this.setLoading(e)
    app.createRoom(function () {
      that.setLoading(e)
      wx.navigateTo({
        url: '/pages/room/room'
      })
    })
  },
  joinRoom: function (e) {
    console.log('加入房间')
    if (this.data.PIN && this.data.PIN.length === 6) {
      app.joinRoom(this.data.PIN, function () {
        wx.navigateTo({
          url: '/pages/room/room'
        })
      })
    }
  },
  setLoading: function (e) {
    this.setData({
      loading: !this.data.loading
    })
  },
  bindHideKeyboard: function (e) {
    this.setData({
      PIN: e.detail.value
    })
    //收起键盘
    if (e.detail.value.length === 6) {
      wx.hideKeyboard()
    }
  },
  tabToMine: function () {
    wx.switchTab({
      url: '../mine/mine'
    })
  }

}) // Page() end.

