import { connect } from 'react-redux'
import AccountAvatar from './AccountAvatar'

const mapStateToProps = ({fileUpload: {file, error: fileUploadError}, auth: {autologinComplete, user}, profile: {success, error}}) => ({
  autologinComplete,
  user,
  success,
  error: error || fileUploadError,
  file
})

export default connect(mapStateToProps)(AccountAvatar)
