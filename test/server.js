import { Server } from 'node-static'
import { createServer } from 'http'
import { red, green, yellow } from 'colors'

const port = 8081
const server = new Server('./build', {cache: 0})
createServer((request, response) => {
  request.addListener('end', () => {
    server
      .serve(request, response, (err, result) => {
        if (err) {
          if (/^\/[a-zA-Z-]+(\?.+)?$/.test(request.url)) {
            server.serveFile('/index.html', 200, {}, request, response)
            console.error(yellow(`200 ${request.url}`))
            return
          }
          console.error(red(`${err.status} ${request.url}`))
          response.writeHead(err.status, err.headers)
          response.end()
          return
        }
        console.error(green(`${result.status} ${request.url}`))
      })
  }).resume()
}).listen(port)

console.log(`Running on http://127.0.0.1:${port} …`)
