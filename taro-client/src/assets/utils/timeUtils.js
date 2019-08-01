function format(fmt, date) {
  // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
/**
 * date:6月30日
 * hour:08
 * minute 30
 * ["6月30日 08:30", "6月30日 09:00", "6月30日 10:00"]
 */
function timeMap(date, hour, minute) {
  var returnDate = []
  if (minute >= 30) {
    // 当前时间已经超过 30分 例如 08：50
    hour = Number(hour) + 1
  }
  for (var i = hour; i <= 24; i++) {
    var _i = ('' + i).length === 1 ? ' 0' + i : ' ' + i
    returnDate.push(date + _i + ':00')
    // if (i !== 24) {
    //   returnDate.push(date + _i + ':30')
    // }
  }
  return returnDate
}

function pickerTap() {
  const date = new Date()
  const monthDay = []
  let todyHours = []
  const hours = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']
  const minutes = ['00', '30']
  const currentHours = date.getHours()

  // yyyy-MM-dd
  for (let i = currentHours >= 22 ? 1 : 0; i < 7; i++) {
    const date1 = new Date(date)
    date1.setDate(date.getDate() + i)
    const month = date1.getMonth() + 1 >= 10 ? date1.getMonth() + 1 : `0${date1.getMonth() + 1}`
    const day = date1.getDate() >=10 ? date1.getDate() : `0${date1.getDate()}`
    const md = `${date1.getFullYear()}-${month}-${day}`
    monthDay.push(md)
  }

  // hours
  if (currentHours >= 22 ) {
    todyHours = [...[], ...hours]
  } else {
    for (let i = currentHours + 1; i < 23; i++) {
      if (i >= 6) {
        todyHours.push(`${i>=10 ? i : `0${i}`}`)
      }
    }
  }
  return { monthDay, todyHours, hours, minutes }
}

export { format, timeMap, pickerTap }
