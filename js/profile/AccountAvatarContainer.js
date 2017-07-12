import { connect } from 'react-redux'
import AccountAvatar from './AccountAvatar'

const mapStateToProps = ({fileUpload: {file, error: fileUploadError}, auth: {autologinComplete, me}, profile: {success, error}}) => ({
  autologinComplete,
  me,
  success,
  error: error || fileUploadError,
  file
})

export default connect(mapStateToProps)(AccountAvatar)
