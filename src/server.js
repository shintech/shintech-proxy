import fs from 'fs'
import os from 'os'
import path from 'path'
import logger from 'winston-color'
import httpProxy from 'http-proxy'

const domainName = process.env.DOMAIN_NAME

const homedir = os.homedir()
const sslPath = path.join(homedir, 'letsencrypt', 'live', domainName)

const proxy = httpProxy.createServer({
  target: {
    host: 'localhost',
    port: 8000
  },
  ssl: {
    key: fs.readFileSync(sslPath + '/privkey.pem'),
    cert: fs.readFileSync(sslPath + '/fullchain.pem')
  }
})

proxy.on('proxyReq', function (req, res) {
  logger.info(req.method, 'http://' + req._headers.host + req.path)
})

proxy.on('error', function (err) {
  logger.error(err)
})

proxy.listen(443)
