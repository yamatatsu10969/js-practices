#!/usr/bin/env node

import * as fns from 'date-fns'

// [JavaScriptでRubyのeach_sliceと同じことをしたい | suke blog](https://suke.io/entry/20190219/)
const eachSlice = (arr, n = 2) => {
  const dup = [...arr]
  const result = []
  let length = dup.length

  while (length > 0) {
    result.push(dup.splice(0, n))
    length = dup.length
  }

  return result
}

function displayHeader (date) {
  const monthAndYear = fns.format(date, '      M月 yyyy')
  console.log(monthAndYear)
  console.log('日 月 火 水 木 金 土')
}

function displayBody (displayDate) {
  const firstDate = fns.startOfMonth(displayDate)
  const lastDate = fns.endOfMonth(displayDate)
  const displayDates = []
  for (let d = firstDate; fns.isBefore(d, lastDate); d = fns.add(d, { days: 1 })) {
    const date = fns.getDate(d)
    if (date === fns.getDate(firstDate)) {
      const day = fns.getDay(d)
      for (let i = 0; i < day; i++) {
        displayDates.push('  ')
      }
    }
    displayDates.push(date.toString().padStart(2, ' '))
  }
  eachSlice(displayDates, 7).forEach(slice => console.log(slice.join(' ')))
}

const today = new Date(2022, 5)

displayHeader(today)
displayBody(today)
