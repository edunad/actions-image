const Request = require('./Request.js')
const { createReadStream } = require('fs')

const { Resolvers: { resolveTime } } = require('../utils')

module.exports = class Litterbox extends Request {
  constructor () {
    super('LITTER')
  }

  /**
   * Upload file that will be available temporarily
   * @param {string} path Relative path of the file to be uploaded
   * @param {number|string} [time='1h'] Duration in hours for file expiration
   * @returns {Promise<string>}
   */
  upload (path, time) {
    if (typeof path !== 'string') {
      throw new TypeError('UPLOAD_INVALID_PARAMETER', 'path', 'a string')
    }

    return this._request({
      reqtype: 'fileupload',
      time: resolveTime(time),
      fileToUpload: createReadStream(path)
    })
  }
}
