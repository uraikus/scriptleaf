const { exec } = require('child_process')
const { version } = require('../package.json')

exec('parcel build dev/browser.js --out-file latest.js --no-source-maps', () => {
  exec(`parcel build dev/browser.js --out-file ${version}.js --no-source-maps`)
})
