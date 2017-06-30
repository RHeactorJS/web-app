import { connect } from 'react-redux'
import PasswordChangeConfirm from '../component/PasswordChangeConfirm'

const mapStateToProps = ({config: {apiIndex, mimeType}}) => ({
  apiIndex,
  mimeType
})

export default connect(mapStateToProps)(PasswordChangeConfirm)
