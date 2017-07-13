import { connect } from 'react-redux'
import AccountEmailChangeConfirm from './AccountEmailChangeConfirm'

const mapStateToProps = ({auth: {autologinComplete}, profile: {success, error}}) => ({
  autologinComplete,
  success,
  error
})

export default connect(mapStateToProps)(AccountEmailChangeConfirm)
