import { connect } from 'react-redux'
import PasswordChangeConfirm from './PasswordChangeConfirm'

const mapStateToProps = ({passwordChange: {confirmSuccess, confirmError}}) => ({
  success: confirmSuccess,
  error: confirmError
})

export default connect(mapStateToProps)(PasswordChangeConfirm)
