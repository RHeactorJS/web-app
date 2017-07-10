import { connect } from 'react-redux'
import AccountProfile from './AccountProfile'

const mapStateToProps = ({auth: {autologinComplete, user}, profile: {success, error}}) => ({
  autologinComplete,
  user,
  success,
  error
})

export default connect(mapStateToProps)(AccountProfile)
