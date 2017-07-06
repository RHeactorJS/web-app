import { connect } from 'react-redux'
import AccountAvatar from '../component/AccountAvatar'
import { success, error, upload } from '../state/fileUpload'
import { userUpdated } from '../state/auth'

const mapStateToProps = ({config: {apiIndex, mimeType, imageServiceIndex}, auth: {token, user, autologinComplete}, fileUpload: {uploadedURI, error, file, data}}) => ({
  apiIndex,
  mimeType,
  imageServiceIndex,
  token,
  user,
  autologinComplete,
  uploadedURI,
  error,
  file,
  data
})

const mapDispatchToProps = ({
  onSuccess: success,
  onError: error,
  onUpload: upload,
  onUserUpdate: userUpdated
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountAvatar)
