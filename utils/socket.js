var config = require('../config.js')
function connect(roomType, pin) {
  wx.connectSocket({
    url: config.service.socketUrl,
    data: {
      roomType: roomType,
      pin: pin
    }
  })
}

function onSocketOpen(res) {
  wx.onSocketOpen(function (res) {
    console.log('WebSocket连接已打开！')
  })
}

function onSocketError(res) {
  wx.onSocketError(function (res) {
    console.log('WebSocket连接打开失败！')
  })
}

function sendMsg(msg) {
  wx.sendSocketMessage({
    data: msg,
  })
}
function recMsg(data) {
  wx.onSocketMessage(function (res) {
    data = res.data
  })
}
function close() {
  wx.closeSocket()
}

module.exports = {
  connect: connect,
  onSocketOpen: onSocketOpen,
  onSocketError: onSocketError,
  sendMsg: sendMsg,
  recMsg: recMsg,
  close: close
}