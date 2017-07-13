/* global process */

process.stdout.write(JSON.stringify({
  'version': '0.0.0+development',
  'environment': 'development',
  'mimeType': 'application/vnd.rheactorjs.core.v2+json',
  'appName': 'RHeactorJS Web app',
  'description': 'This is a UI for the RHeactorJS/server capabilities.',
  'apiIndex': 'http://127.0.0.1:8080/api',
  'imageServiceIndex': process.env.IMAGE_SERVICE_INDEX,
  'themeColor': '#3399ff'
}))
