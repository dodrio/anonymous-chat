'use strict'

const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const cache = {}

const server = http.createServer(requestHandler)

function requestHandler (req, res) {
  const { pathname, query } = url.parse(req.url)
  let filePath

  switch (pathname) {
    case '/':
      if (query) {
        filePath = 'public/chat.html'
      } else {
        filePath = 'public/instruction.html'
      }
      break
    case '/jquery/jquery.min.js':
      filePath = 'node_modules/jquery/dist/jquery.min.js'
      break
    default:
      filePath = `public/${pathname}`
  }

  const absPath = `./${filePath}`
  serveStatic(res, cache, absPath)
}

function send404 (res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  })
  res.write('Error 404: resource not found.')
  res.end()
}

function sendFile (res, filePath, fileContents) {
  res.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  })
  res.write(fileContents)
  res.end()
}

function serveStatic (res, cache, absPath) {
  /**
   * if (cache[absPath]) {
   *   sendFile(res, absPath, cache[absPath])
   * } else {
   */
  fs.readFile(absPath, (err, data) => {
    if (err) {
      send404(res)
    } else {
      cache[absPath] = data
      sendFile(res, absPath, data)
    }
  })
}

module.exports = server
