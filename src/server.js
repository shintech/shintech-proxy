import fs from 'fs'
import os from 'os'
import path from 'path'
import logger from 'winston-color'
import connect from 'connect'
import https from 'https'
import pkg from '../package.json'
import chalk from 'chalk'
import httpProxy from 'http-proxy-middleware'

const domainName = process.env.DOMAIN_NAME
const packageName = pkg.name
const packageVersion = pkg.version
const homedir = os.homedir()
const port = process.env.PORT
const sslPath = path.join(homedir, 'letsencrypt', 'live', domainName)

var options = {
  target: {
    host: 'localhost',
    port: 8000
  },
  logProvider: logProvider
}

var serverConfig = {
  key: fs.readFileSync(sslPath + '/privkey.pem'),
  cert: fs.readFileSync(sslPath + '/fullchain.pem')
}

var proxy = httpProxy(options)

var app = connect()

app.use(proxy)

var server = https.createServer(serverConfig, app).listen(port)

server.on('listening', function (req, res) {
  logger.info(`${chalk.bgBlack.cyan(packageName)} ver.${chalk.bgBlack.green(packageVersion)} listening on port ${chalk.bgBlack.yellow(port)}`)
})

server.on('request', function (req, res) {
  logger.info(chalk.cyan(req.method), 'http://' + req.headers.host + req.url, res.statusCode)
})

server.on('error', function (err) {
  logger.error(err)
})

function logProvider (provider) {
  return logger
}
