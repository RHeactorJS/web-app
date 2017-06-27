import {Server} from 'node-static'
import {createServer} from 'http'
import {red, green} from 'colors'

const port = 8081
const file = new Server('./build')
createServer((request, response) => {
  request.addListener('end', () => {
    file
      .serve(request, response, (err, result) => {
        if (err) {
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
