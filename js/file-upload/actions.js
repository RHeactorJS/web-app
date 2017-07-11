const FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR'
export const FILE_UPLOAD_SUCCESS = 'FILE_UPLOAD_SUCCESS'
export const UPLOAD_FILE_FOR = 'UPLOAD_FILE_FOR'
export const UPLOADING = 'UPLOADING'

export const error = error => ({
  type: FILE_UPLOAD_ERROR,
  error
})

export const success = (uri, target) => ({
  type: FILE_UPLOAD_SUCCESS,
  uri,
  target
})

export const uploadFileFor = (file, target) => ({
  type: UPLOAD_FILE_FOR,
  file,
  target
})

export const uploading = file => ({
  type: UPLOADING,
  file
})

export default (state = {uploadedURI: false, error: false, file: false}, action) => {
  switch (action.type) {
    case FILE_UPLOAD_ERROR:
      return {
        uploadedURI: false,
        error: action.error,
        file: false,
        data: undefined
      }
    case UPLOADING:
      return {
        uploadedURI: false,
        error: false,
        file: action.file
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
