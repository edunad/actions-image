const { parse } = require('url')

module.exports = class Utils {
  /**
   * Tells whether the input is a URL or a path
   * @param {string} input
   * @returns {Object}
   */
  static isURL (input) {
    const { slashes, href, path } = parse(input)

    return {
      is: slashes,
      url: href,
      path
    }
  }
}

module.exports.Constants = require('./Constants.js')
module.exports.Resolvers = require('./Resolvers.js')
