const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const diffDay = date => {
  var _date = new Date(date.replace(/-/g, '/'))
  return  parseInt((_date - new Date()) / 1000 / 60 / 60 / 24)
}

module.exports = {
  formatTime: formatTime,
  diffDay: diffDay
}
