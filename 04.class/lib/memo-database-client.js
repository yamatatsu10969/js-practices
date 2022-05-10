#!/usr/bin/env node

class MemoDatabaseClient {
  constructor () {
    const sqlite3 = require('sqlite3')
    const fs = require('fs')
    fs.existsSync('memo.db') || fs.writeFileSync('memo.db', '')
    this.db = new sqlite3.Database('../memo.db')
  }

  async initialize () {
    return new Promise(resolve => {
      this.db.run(`
      CREATE TABLE IF NOT EXISTS memos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      body TEXT NOT NULL)`,
      (_result, _error) => resolve())
    })
  }

  async all () {
    console.log('all')
    return new Promise(resolve =>
      this.db.all('SELECT * FROM memos', (_, rows) => {
        return resolve(rows)
      })
    )
  }

  async save (body) {
    console.log('save')
    return new Promise(resolve =>
      this.db.run(
        'INSERT INTO memos(body) values(?)',
        body,
        (_result, _err) => resolve()
      )
    )
  }

  async delete (id) {
    console.log('delete')
    this.db.run('DELETE FROM memos WHERE id = ?', id)
  }

  // TODO: 後で消す
  async dropTableForTesting () {
    return new Promise(resolve => {
      this.db.run('DROP TABLE IF EXISTS memos',
        (_result, _error) => resolve())
    })
  }

  dispose () {
    this.db.close()
  }
}

const memoDatabaseClient = new MemoDatabaseClient()

module.exports.memoDatabaseClient = memoDatabaseClient
