
async function saveMemo (memoDBClient) {
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

async function showMemoList (memoDBClient) {
  const memos = await memoDBClient.all()
  if (memos.length === 0) return []
  memos.forEach(memo => console.log(memo.body.split('\n')[0]))
}

async function deleteMemo (memoDBClient) {
  const { prompt } = require('enquirer')
  const memos = await memoDBClient.all()
  const choices = memos.map(function (memo) {
    return {
      name: memo.body.split('\n')[0],
      message: memo.body.split('\n')[0],
      value: memo.id
    }
  })

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
  await memoDBClient.delete(answer.memoId)
}

async function readMemo (memoDBClient) {
  const { prompt } = require('enquirer')
  const memos = await memoDBClient.all()
  const choices = memos.map(function (memo) {
    return {
      name: '\n' + memo.body,
      message: memo.body.split('\n')[0]
    }
  })

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
  try {
    const MemoDBClient = require('./memo-database-client.js')
    const memoDBClient = new MemoDBClient()
    await memoDBClient.initialize()
    const argv = require('minimist')(process.argv.slice(2))
    if (argv.l) {
      await showMemoList(memoDBClient)
    } else if (argv.d) {
      await deleteMemo(memoDBClient)
    } else if (argv.r) {
      await readMemo(memoDBClient)
    } else {
      await saveMemo(memoDBClient)
    }
  } catch (e) {
    console.log(e.message)
  }
}

main()
