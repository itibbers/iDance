//app.js
var config = require('./config')
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // 获取用户信息
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          // 请求获得openid
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.appid + '&secret=' + config.secret + '&js_code=' + res.code + '&grant_type=authorization_code',
            success: function (u) {
              // console.log(u)
              that.globalData.openid = u.data.openid
            }
          })
          // 获得用户信息
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  // 获取位置
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.globalData.location = res
        console.log('纬经度：' + res.latitude + ' ' + res.longitude)
      }
    })
  },
  // 查看群组
  checkRoom: function (cb) {
    var that = this
    wx.request({
      url: config.service.checkRoomUrl,
      data: {
        uid: that.globalData.openid
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.is == 'true') {
          typeof cb == 'function' && cb()
        }
      }
    })
  },
  // 创建房间
  createRoom: function (cb) {
    // 请求获得PIN
    var that = this
    that.globalData.roomType = 'creator'
    wx.request({
      url: config.service.createUrl,
      data: {
        uid: that.globalData.openid,
        latitude: that.globalData.location.latitude,
        longitude: that.globalData.location.longitude
      },
      method: 'POST',
      // 解决post bug
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.globalData.PIN = res.data.pin
        typeof cb == 'function' && cb()
      },
      fail: function (res) {
        console.log('创建房间失败！')
      }
    })
  },
  // 加入房间
  joinRoom: function (pin, cb) {
    this.globalData.PIN = pin
    this.globalData.roomType = 'joiner'
    var that = this
    wx.request({
      url: config.service.joinUrl,
      data: {
        uid: that.globalData.openid,
        pin: pin
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.msg == 'ok') {
          typeof cb == 'function' && cb()
        } else if (res.data.msg == 'noroom') {
          wx.showToast({
            title: '房间不存在',
            mask: true
          })
        } else if (res.data.msg == 'me') {
          wx.showToast({
            title: '不能加入自己的房间',
            mask: true
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器开小差了',
          icon: '',
          mask: true
        })
      }
    })
  },
  globalData: {
    openid: null,
    userInfo: null,
    location: {
      latitude: null,
      longitude: null,
      speed: null,
      accuracy: null
    },
    roomType: "joiner",
    PIN: "未创建房间",
    backgroundAudioPlaying: false
  }
})