const Package = require('../../package.json')

/**
 * HTTP addresses
 * @typedef {Object} HTTPAddresses
 * @property {string} [cat='https://catbox.moe/user/api.php'] Base URL of the API
 * @property {string} [litter='https://litterbox.catbox.moe/resources/internals/api.php'] Base URL of the API of temporary files
 */
exports.HTTPAddresses = {
  cat: 'https://catbox.moe/user/api.php',
  litter: 'https://litterbox.catbox.moe/resources/internals/api.php'
}

exports.UserAgent = `Catbox (${Package.homepage.split('#')[0]}, ${Package.version}) Node.js/${process.version}`

/**
 * The time to expire, e.g. `1`
 * * 1
 * * 12
 * * 24
 * * 72
 * @typedef {number} ExpiryHour
 */
exports.ExpiryHours = [1, 12, 24, 72]
