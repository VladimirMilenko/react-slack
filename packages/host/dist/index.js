
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./host.cjs.production.min.js')
} else {
  module.exports = require('./host.cjs.development.js')
}
