import { connect } from 'react-redux'
import AccountAvatar from '../component/AccountAvatar'
import { userUpdated } from '../state/auth'
import { error, upload } from '../state/fileUpload'

const mapStateToProps = ({config: {apiIndex, mimeType, imageService}, auth: {token, user, autologinComplete}, fileUpload: {error, file, data}}) => ({
  apiIndex,
  mimeType,
  imageService,
  token,
  user,
  autologinComplete,
  error,
  file,
  data
})

const mapDispatchToProps = ({
  onUserUpdate: userUpdated,
  onError: error,
  onUpload: upload
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountAvatar)
