#!/usr/bin/env node

const Memo = require('./memo.js')

module.exports = class MemoDatabaseClient {
  constructor () {
    const sqlite3 = require('sqlite3')
    this.db = new sqlite3.Database('./memo.db')
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
    const promise = new Promise(resolve =>
      this.db.all('SELECT * FROM memos', (_, rows) => {
        return resolve(rows)
      })
    )
    const jsons = await promise
    return jsons.map(json => {
      return new Memo(json.id, json.body)
    })
  }

  async save (body) {
    return new Promise(resolve =>
      this.db.run(
        'INSERT INTO memos(body) values(?)',
        body,
        (_result, _err) => resolve()
      )
    )
  }

  async delete (id) {
    return new Promise(resolve =>
      this.db.run(
        'DELETE FROM memos WHERE id = ?',
        id,
        (_result, _err) => resolve()
      )
    )
  }
}
