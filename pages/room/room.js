var util = require('../../utils/util.js')
var config = require('../../config.js')
var socket = require('../../utils/socket.js')
var app = getApp()
Page({
  data: {
    item: {
      pin: app.globalData.PIN,
      roomType: app.globalData.roomType,
      songs: [],
      currentSong: null,

      playing: false,
      playTime: 0,
      formatedPlayTime: '00:00:00',
      duration: 300
    }
  },
  onLoad: function () {
    // 请求获得播放列表
    this.getSongs()
    this.setData({
      'item.pin': app.globalData.PIN,
      'item.roomType': app.globalData.roomType
    })
    wx.setNavigationBarTitle({
      title: 'PIN:' + this.data.item.pin
    })
    // 音乐
    this._enableInterval()
    if (app.globalData.backgroundAudioPlaying) {
      this.setData({
        'item.playing': true
      })
    }
    socket.connect(this.data.item.roomType, this.data.item.pin)
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audioTo: function (num) {
    this.audioCtx.seek(num)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },
  // 请求获得播放列表
  getSongs: function () {
    var that = this
    wx.request({
      url: config.service.getSongsUrl,
      success: function (res) {
        that.setData({
          'item.songs': res.data,
          'item.currentSong': res.data[0]
        })
      }
    })
  },
  // 音乐控制
  change: function (e) {
    var id = e.target.dataset.id
    this.setData({
      'item.currentSong': this.data.item.songs[id]
    })
    this.play()
  },
  next: function () {
    this.setData({
      'item.playing': false
    })
    var id = this.data.item.currentSong.id
    var songs = this.data.item.songs
    this.setData({
      'item.currentSong': songs[id % songs.length]
    })
    this.play()
  },
  play: function (e) {
    var that = this
    if (!this.data.item.currentSong) {
      that.setData({
        'item.currentSong': that.data.item.songs[0]
      })
    }
    var song = this.data.item.currentSong
    wx.playBackgroundAudio({
      dataUrl: song.src,
      title: song.name,
      coverImgUrl: song.poster,
      complete: function (res) {
        that.setData({
          'item.playing': true
        })
      }
    })
    this._enableInterval()
    app.globalData.backgroundAudioPlaying = true
    this.updateStatus()
  },
  seek: function (e) {
    clearInterval(this.updateInterval)
    var that = this
    wx.seekBackgroundAudio({
      position: e.detail.value,
      complete: function () {
        // 实际会延迟两秒左右才跳过去
        setTimeout(function () {
          that._enableInterval()
        }, 2000)
      }
    })
  },
  pause: function () {
    var that = this
    var song = this.data.item.currentSong
    wx.pauseBackgroundAudio({
      dataUrl: song.src,
      success: function () {
        that.setData({
          'item.playing': false
        })
      }
    })
    app.globalData.backgroundAudioPlaying = false
  },
  stop: function () {
    var that = this
    var song = this.data.item.currentSong
    wx.stopBackgroundAudio({
      dataUrl: song.src,
      success: function (res) {
        that.setData({
          'item.playing': false,
          'item.playTime': 0,
          'item.formatedPlayTime': util.formatTime(0)
        })
      }
    })
    app.globalData.backgroundAudioPlaying = false
  },
  _enableInterval: function () {
    var that = this
    update()
    this.updateInterval = setInterval(update, 500)
    function update() {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          if (res.status == 1) {
            that.setData({
              'item.playing': true
            })
          } else {
            that.setData({
              'item.playing': false
            })
          }
          that.setData({
            'item.duration': res.duration,
            'item.playTime': res.currentPosition,
            'item.formatedPlayTime': util.formatTime(res.currentPosition + 1)
          })
          // 循环播放
          if (that.data.item.playing == true && res.duration && res.currentPosition == res.duration) {
            that.next()
          }
        }
      })
    }
  },
  updateStatus: function () {
    var that = this
    var item = this.data.item
    if (this.data.item.roomType == 'creator') {
      // creator 更新状态
      wx.request({
        url: config.service.updateStatusUrl,
        data: {
          pin: item.pin,
          songId: item.currentSong.id,
          playTime: item.playTime,
          playing: item.playing,
          // isOpen: item.isOpen
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {

        }
      })
    } else {
      // joiner 更新状态
      wx.request({
        url: config.service.syncUrl,
        data: {
          pin: item.pin
        },
        methon: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {

        }
      })
    }
  },
  onUnload: function () {
    clearInterval(this.updateInterval)
  }
})



// {
//   poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
//     name: '最炫民族风',
//       author: '凤凰传奇',
//         src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
//       }