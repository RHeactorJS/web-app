import { connect } from 'react-redux'
import AccountProfile from './AccountProfile'

const mapStateToProps = ({auth: {autologinComplete, me}, profile: {success, error}}) => ({
  autologinComplete,
  me,
  success,
  error
})

export default connect(mapStateToProps)(AccountProfile)
