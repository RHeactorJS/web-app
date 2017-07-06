const FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR'
const FILE_UPLOAD = 'FILE_UPLOAD'
export const FILE_UPLOAD_SUCCESS = 'FILE_UPLOAD_SUCCESS'

export const error = error => ({
  type: FILE_UPLOAD_ERROR,
  error
})

export const upload = (file, data) => ({
  type: FILE_UPLOAD,
  file,
  data
})

export const success = (uri, target) => ({
  type: FILE_UPLOAD_SUCCESS,
  uri,
  target
})

export default (state = {uploadedURI: false, error: false, file: false, data: undefined}, action) => {
  switch (action.type) {
    case FILE_UPLOAD_ERROR:
      return {
        uploadedURI: false,
        error: action.error,
        file: false,
        data: undefined
      }
    case FILE_UPLOAD:
      return {
        uploadedURI: false,
        error: false,
        file: action.file,
        data: action.data
      }
    case FILE_UPLOAD_SUCCESS:
      return {
        uploadedURI: action.uri,
        error: false,
        file: false,
        data: false
      }
    default:
      return state
  }
}
