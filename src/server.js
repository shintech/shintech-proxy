import path from 'path'
import fs from 'fs'
import os from 'os'
import http from 'http'

const domainName = 'dev.shintech.ninja'

const homedir = os.homedir()
const sslPath = path.join(homedir, 'letsencrypt', 'live', domainName)

var serverConfig = {
  key: fs.readFileSync(sslPath + '/privkey.pem'),
  cert: fs.readFileSync(sslPath + '/fullchain.pem')
}

const https = require('https').Server(serverConfig, onRequest)

function onRequest (clientReq, clientRes) {
  var options = {
    hostname: 'localhost',
    port: 8000,
    path: clientReq.url,
    method: 'GET'
  }

  var proxy = http.request(options, function (res) { // eslint-disable-line
    res.pipe(clientRes, {
      end: true
    })
  })

  clientReq.pipe(proxy, {
    end: true
  })
}

https.listen(443)
