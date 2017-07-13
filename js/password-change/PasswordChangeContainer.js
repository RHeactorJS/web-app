import { connect } from 'react-redux'
import PasswordChange from './PasswordChange'

const mapStateToProps = ({passwordChange: {requestSuccess, requestError}}) => ({
  success: requestSuccess,
  error: requestError
})

export default connect(mapStateToProps)(PasswordChange)
