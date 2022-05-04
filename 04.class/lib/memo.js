#!/usr/bin/env node

class Memo {
  constructor (id, body) {
    this.id = id
    this.body = body
  }
}

const memoDBClient = require('./memo-database-client.js').memoDatabaseClient

async function saveMemo () {
  process.stdin.setEncoding('utf8')
  const lines = []
  const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  reader.on('line', (line) => {
    lines.push(line)
  })
  reader.on('close', () => {
    memoDBClient.save(lines.join('\n'))
  })
}

async function showMemoList () {
  memoDBClient.all()
    .then(jsons => {
      return jsons.map(json => new Memo(json.id, json.body))
    })
    .then(memos =>
      memos.forEach(memo => console.log(memo.body.split('\n')[0]))
    )
}

async function deleteMemo () {
  // TODO(yamatatsu): delete

}

async function readMemo () {
  // TODO(yamatatsu): read

}

async function main () {
  await memoDBClient.initialize()

  const argv = require('minimist')(process.argv.slice(2))

  if (argv.l) {
    await showMemoList()
  } else if (argv.d) {
    await deleteMemo()
  } else if (argv.r) {
    await readMemo()
  } else {
    await saveMemo()
  }
}

main()
