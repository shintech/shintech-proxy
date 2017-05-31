import path from 'path'
import fs from 'fs'
import os from 'os'
import request from 'request'
import logger from 'winston-color'

const domainName = process.env.DOMAIN_NAME

const homedir = os.homedir()
const sslPath = path.join(homedir, 'letsencrypt', 'live', domainName)

var serverConfig = {
  key: fs.readFileSync(sslPath + '/privkey.pem'),
  cert: fs.readFileSync(sslPath + '/fullchain.pem')
}

const https = require('https').Server(serverConfig)

https.on('listening', function () {
  logger.info('listening on port 443...')
})
const servers = ['dev.shintech.ninja:8000', 'dev.shintech.ninja:8001', 'dev.shintech.ninja:8002']

var count = 0
var url
https.on('request', function (req, res) {
  url = 'http://' + servers[count] + req.url

  logger.info(req.method, url, res.statusCode)

  var body = ''

  req.on('data', function (chunk) {
    body += chunk
  })

  req.on('end', function () {
    if (req.method === 'POST') {
      body = tryJSON(body).value

      request.post(url).form(body).pipe(res)
    }
    if (req.method === 'GET') {
      request.get(url).pipe(res)
    }
      count += 1

  if (count >= servers.length) {
    count = 0
  }   

  })

  req.on('error', function (err) {
    logger.error(err)
  })
})

https.on('error', function (err) {
  logger.error(err)
})

function tryJSON (str) {
  try {
    return { value: JSON.parse(str), valid: true }
  } catch (err) {
    return { value: str, valid: false }
  }
}

https.listen(443)
