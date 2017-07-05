const FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR'
const FILE_UPLOAD = 'FILE_UPLOAD'

export const error = error => ({
  type: FILE_UPLOAD_ERROR,
  error
})

export const upload = (file, data) => ({
  type: FILE_UPLOAD,
  file,
  data
})

export default (state = {error: false, file: false, data: undefined}, action) => {
  switch (action.type) {
    case FILE_UPLOAD_ERROR:
      return {
        error: action.error,
        file: false,
        data: undefined
      }
    case FILE_UPLOAD:
      return {
        error: false,
        file: action.file,
        data: action.data
      }
    default:
      return state
  }
}
