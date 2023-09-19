const Request = require('./Request.js')
const { createReadStream } = require('fs')

const { isURL, Resolvers: { resolveFiles, resolveShort } } = require('../utils')

module.exports = class Catbox extends Request {
  /**
   * @param {string} [userHash] The hash of the user to use to perform operations on your account
   */
  constructor (userHash) {
    super('CAT', userHash)
  }

  /**
   * Upload files
   * @param {string} urlOrPath A URL or path to the file
   * @returns {Promise<string>}
   */
  upload (urlOrPath) {
    if (typeof urlOrPath !== 'string') {
      throw new TypeError('UPLOAD_INVALID_PARAMETER', 'urlOrPath', 'a string')
    }

    const _isURL = isURL(urlOrPath)

    return this._request(
      _isURL.is
        ? {
          reqtype: 'urlupload',
          url: _isURL.url
        }
        : {
          reqtype: 'fileupload',
          fileToUpload: createReadStream(_isURL.path)
        }
    )
  }

  /**
   * Delete one or more files
   * @param {...string|string[]} files URL or short code of the files
   * @returns {Promise<string>}
   */
  delete (...files) {
    this._hasUserHash('delete')

    return this._request({
      reqtype: 'deletefiles',
      files: resolveFiles(files)
    })
  }

  /**
   * Get album information
   * @param {string} short Album short URL or code
   * @returns {Promise<Object>}
   */
  getAlbum (short) {
    if (typeof short !== 'string') {
      throw new TypeError('GET_ALBUM_INVALID_PARAMETER', 'short', 'a string')
    }

    return this._request({
      reqtype: 'getalbum',
      short: resolveShort(short)
    })
      .then((data) => JSON.parse(data).data)
  }

  /**
   * Create a new album for your account or anonymously
   * @param {Object} [options] Options for the creating
   * @param {string} [options.title] Name for the album
   * @param {string} [options.description] Description for the album
   * @param {string[]} [options.files] Short code or files URL to add to album
   * @returns {Promise<string>}
   */
  createAlbum (
    {
      title = '',
      description = '',
      files = []
    } = {}
  ) {
    return this._request({
      reqtype: 'createalbum',
      title,
      desc: description,
      files: files.length ? resolveFiles(files) : ''
    })
  }

  /**
   * Edit album info
   * @param {Object} options Options for the editing
   * @param {string} options.short Album short code or URL
   * @param {string} [options.title] New name for the album
   * @param {string} [options.description] New description for the album
   * @param {string[]} [options.files] Short code or files URL to add to album
   * @returns {Promise<string>}
   */
  async editAlbum (
    {
      short = '',
      title = '',
      description = '',
      files = []
    } = {}
  ) {
    this._hasUserHash('editAlbum')

    if (!short) {
      throw new Error('Provide the short code for the album')
    }

    const album = await this.getAlbum(short)

    return this._request({
      reqtype: 'editalbum',
      short: resolveShort(short),
      title: title || album.title,
      desc: description || album.description,
      files: files.length ? resolveFiles(album.files.split(' '), files) : ''
    })
  }

  /**
   * Add files to an album
   * @param {Object} options Options for the add of files
   * @param {string} options.short Album short code or URL
   * @param {string[]} options.files Short code or URL of files
   * @returns {Promise<string>}
   */
  addFilesAlbum (
    {
      short = '',
      files = []
    } = {}
  ) {
    this._hasUserHash('addFilesAlbum')

    if (!short || !files.length) {
      throw new Error('Malformed request')
    }

    return this._request({
      reqtype: 'addtoalbum',
      short: resolveShort(short),
      files: resolveFiles(files)
    })
  }

  /**
   * Remove files from an album
   * @param {Object} options Options for the remove of files
   * @param {string} options.short Album short code or URL
   * @param {string[]} options.files Short code or URL of files
   * @returns {Promise<string>}
   */
  removeFilesAlbum (
    {
      short = '',
      files = []
    } = {}
  ) {
    this._hasUserHash('removeFilesAlbum')

    if (!short || !files.length) {
      throw new Error('Malformed request')
    }

    return this._request({
      reqtype: 'removefromalbum',
      short: resolveShort(short),
      files: resolveFiles(files)
    })
  }

  /**
   * Delete album
   * @param {string} short Short code or album URL
   * @returns {Promise<void>}
   */
  deleteAlbum (short) {
    this._hasUserHash('deleteAlbum')

    if (typeof short !== 'string') {
      throw new TypeError('DELETE_ALBUM_INVALID_PARAMETER', 'short', 'a string')
    }

    return this._request({
      reqtype: 'deletealbum',
      short: resolveShort(short)
    })
  }

  _hasUserHash (method) {
    if (!this.userHash) {
      throw new Error(`You must add a user hash in constructor to use the "${method}" method`)
    }
  }
}
