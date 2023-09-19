const fetch = require('node-fetch')
const FormData = require('form-data')

const { Constants } = require('../utils')

module.exports = class Request {
  constructor (http, userHash) {
    this.http = Constants.HTTPAddresses[http.toLowerCase()]

    if (typeof userHash !== 'string' && typeof userHash !== 'undefined') {
      throw new TypeError('USER_HASH_INVALID', 'userHash', 'a string')
    }

    this.userHash = userHash
  }

  _request (body = {}) {
    if (this.userHash) body.userhash = this.userHash

    return fetch(this.http, {
      method: 'POST',
      headers: {
        'User-Agent': Constants.UserAgent
      },
      body: this._parseForm(body)
    })
      .then((response) => response.text())
  }

  _parseForm (data) {
    const _FormData = new FormData()

    Object.entries(data)
      .filter(([key, value]) => value !== null)
      .map(([key, value]) => _FormData.append(key, value))

    return _FormData
  }
}
