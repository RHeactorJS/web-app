import { connect } from 'react-redux'
import AccountAvatar from '../component/AccountAvatar'
import { success, error, upload } from '../state/fileUpload'
import { userUpdated } from '../login/actions'

const mapStateToProps = ({fileUpload: {uploadedURI, error, file, data}}) => ({
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
