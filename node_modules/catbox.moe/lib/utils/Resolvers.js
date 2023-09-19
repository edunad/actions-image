const { parse } = require('url')
const Constants = require('./Constants.js')

module.exports = class Resolvers {
  /**
   * Resolves a array or spread strings of short code to  array
   * @param {...string|string[]} files Short code of files
   * @return {string}
   */
  static resolveFiles (...files) {
    return [].concat.apply([], files)
      .filter((file) => !file.includes(' '))
      .map((file) => parse(file).slashes ? parse(file).path.slice(1) : file)
      .join(' ')
  }

  /**
   * Resolves a short code or album URL to a short code
   * @param {string} short Short code or URL of an album
   * @returns {string}
   */
  static resolveShort (short) {
    short = parse(short).path
    return short.slice(0, 3) === '/c/' ? short.slice(3) : short
  }

  /**
   * Resolves a number or a string with time in hours for an expiration time in hours
   * @param {number|string} time Expiry hours
   * @return {string}
   */
  static resolveTime (time, defaultTime = '1h') {
    if (typeof time === 'number') {
      return Constants.ExpiryHours.includes(time) ? `${time}h` : defaultTime
    } else if (typeof time === 'string') {
      return time.replace(/(\d+)(hours?|hrs?|h)/, (match, hours) => hours && Constants.ExpiryHours.includes(Number(hours)) ? `${hours}h` : defaultTime)
    } else {
      return defaultTime
    }
  }
}
