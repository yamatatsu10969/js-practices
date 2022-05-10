#!/usr/bin/env node

const memoDBClient = require('./memo-database-client.js').memoDatabaseClient
class Memo {
  constructor (id, body) {
    this.id = id
    this.body = body
  }

  static async all () {
    const jsons = await memoDBClient.all()
    if (jsons.length === 0) return []
    return jsons.map(json => new Memo(json.id, json.body))
  }

  static save (body) {
    memoDBClient.save(body)
  }

  static delete (id) {
    memoDBClient.delete(id)
  }
}

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
    Memo.save(lines.join('\n'))
  })
}

async function showMemoList () {
  Memo.all()
    .then(memos => {
      if (memos.length === 0) return []
      memos.forEach(memo => console.log(memo.body.split('\n')[0]))
    })
}

async function deleteMemo () {
  const { prompt } = require('enquirer')
  const choices = await Memo.all()
    .then(memos =>
      memos.map(function (memo) {
        return {
          name: memo.body.split('\n')[0],
          message: memo.body.split('\n')[0],
          value: memo.id
        }
      })
    )

  if (choices.length === 0) {
    throw new Error('No memo')
  }

  const answer = await prompt({
    type: 'select',
    name: 'memoId',
    message: 'Choose a note you want to delete:',
    choices,
    result (names) {
      const value = this.map(names)[names]
      return value
    }
  })
  Memo.delete(answer.memoId)
}

async function readMemo () {
  const { prompt } = require('enquirer')
  const choices = await Memo.all()
    .then(memos =>
      memos.map(function (memo) {
        return {
          name: '\n' + memo.body,
          message: memo.body.split('\n')[0]
        }
      })
    )

  if (choices.length === 0) {
    throw new Error('No memo')
  }

  await prompt({
    type: 'select',
    message: 'Choose a note you want to see:',
    choices
  })
}

async function main () {
  await memoDBClient.initialize()

  const argv = require('minimist')(process.argv.slice(2))

  try {
    if (argv.l) {
      await showMemoList()
    } else if (argv.d) {
      await deleteMemo()
    } else if (argv.r) {
      await readMemo()
    } else {
      await saveMemo()
    }
  } catch (e) {
    console.log(e.message)
  } finally {
    memoDBClient.dispose()
  }
}

main()
