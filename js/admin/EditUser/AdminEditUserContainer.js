import { connect } from 'react-redux'
import AdminEditUser from './AdminEditUser'

const mapStateToProps = ({auth: {me, autologinComplete}, adminEditUser: {fetching, user, changing, success, error}}) => ({
  me,
  autologinComplete,
  fetching,
  user,
  changing,
  success,
  error
})

export default connect(mapStateToProps)(AdminEditUser)
