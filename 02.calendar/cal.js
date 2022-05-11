#!/usr/bin/env node

const fns = require('date-fns')

// [JavaScriptでRubyのeach_sliceと同じことをしたい | suke blog](https://suke.io/entry/20190219/)
const eachSlice = (arr, n = 2) => {
  const dup = [...arr]
  const result = []

  while (dup.length > 0) {
    result.push(dup.splice(0, n))
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

function main () {
  const now = new Date()
  const argv = require('minimist')(process.argv.slice(2))
  const month = isNaN(argv.m) ? fns.getMonth(now) : argv.m - 1
  const year = isNaN(argv.y) ? fns.getYear(now) : argv.y
  const date = new Date(year, month)
  displayHeader(date)
  displayBody(date)
}

main()
