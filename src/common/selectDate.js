export const selectDate = [
  {
    text: '今天',
    onClick (picker) {
      const end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
      const start = new Date(new Date().toLocaleDateString()).getTime()
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '昨天',
    onClick (picker) {
      const start = new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000
      const end = start + 24 * 60 * 60 * 1000 - 1
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '本周',
    onClick (picker) {
      const date = new Date()
      const weekday = date.getDay() || 7
      const end = new Date().getTime()
      const start = date.setDate(date.getDate() - weekday + 1)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '上周',
    onClick (picker) {
      var now = new Date()// 当前日期
      var nowDayOfWeek = now.getDay()// 今天本周的第几天
      var nowDay = now.getDate()// 当前日
      var nowMonth = now.getMonth()// 当前月
      var nowYear = now.getYear()// 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0//
      var start = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6).getTime()
      const end = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).getTime() + 24 * 60 * 60 * 1000 - 1
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '本月',
    onClick (picker) {
      const end = new Date().getTime()
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '上月',
    onClick (picker) {
      var now = new Date()// 当前日期
      var nowYear = now.getYear()// 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0//
      var lastMonthDate = new Date()// 上月日期
      lastMonthDate.setDate(1)
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
      var lastMonth = lastMonthDate.getMonth()
      // 获得某月天数
      var monthStartDate = new Date(nowYear, lastMonth, 1)
      var monthEndDate = new Date(nowYear, lastMonth + 1, 1)
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      // ---------------------------------------
      const start = new Date(nowYear, lastMonth, 1).getTime()
      const end = new Date(nowYear, lastMonth, days).getTime() + 24 * 60 * 60 * 1000 - 1
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '本季',
    onClick (picker) {
      var now = new Date()// 当前日期
      var nowYear = now.getYear()// 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0//
      var m = now.getMonth() + 1
      const q = parseInt((m + 2) / 3)
      m = q * 3 - 2 // 得到季的首月份
      now.setMonth(m - 1)
      now.setDate(1)
      const start = new Date(nowYear, now.getMonth(), 1).getTime()
      var nextMonthFirstDay = new Date(nowYear, now.getMonth() + 3, 1)
      const end = nextMonthFirstDay.getTime() - 1
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '上季',
    onClick (picker) {
      var now = new Date()// 当前日期
      var nowYear = now.getYear()// 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0//
      var m = now.getMonth() + 1
      const q = parseInt((m + 2) / 3)
      m = q * 3 - 2 // 得到季的首月份
      now.setMonth(m - 1)
      var start, end, nextMonthFirstDay
      if (m - 1 > 2) {
        start = new Date(nowYear, now.getMonth() - 3, 1).getTime()
        nextMonthFirstDay = new Date(nowYear, now.getMonth(), 1)
        end = nextMonthFirstDay.getTime() - 1
      } else {
        start = new Date(nowYear, 10, 1).getTime()
        nextMonthFirstDay = new Date(nowYear, now.getMonth(), 1)
        end = nextMonthFirstDay.getTime() - 1
      }
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '今年',
    onClick (picker) {
      const end = new Date().getTime()
      const start = new Date(new Date().getFullYear(), 0).getTime()
      picker.$emit('pick', [start, end])
    }
  }
]
export const seletTime = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1]
export const startTime = new Date(new Date().toLocaleDateString()).getTime()
export const endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
