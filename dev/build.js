const { exec } = require('child_process')
const { version } = require('../package.json')

exec('parcel build dev/browser.js --out-file scriptleaf-latest.js --no-source-maps', () => {
  exec(`parcel build dev/browser.js --out-file scriptleaf-${version}.js --no-source-maps`)
})
