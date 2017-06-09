function formatTime(time) {
  if (isNaN(time) || time < 0) {
    return '00:00:00'
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

module.exports = {
  formatTime: formatTime
}
