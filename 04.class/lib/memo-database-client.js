#!/usr/bin/env node

class MemoDatabaseClient {
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
    return new Promise(resolve =>
      this.db.all('SELECT * FROM memos', (_, rows) => {
        return resolve(rows)
      })
    )
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

const memoDatabaseClient = new MemoDatabaseClient()

module.exports.memoDatabaseClient = memoDatabaseClient
