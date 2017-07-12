import { connect } from 'react-redux'
import AdminEditUser from './AdminEditUser'

const mapStateToProps = ({auth: {me, autologinComplete}, admin: {fetchingUsers, usersList, changingUser, changeUserError, changeUserSuccess}}) => ({
  me,
  autologinComplete,
  fetchingUsers,
  user: usersList && usersList[0],
  success: changeUserSuccess,
  error: changeUserError,
  changingUser
})

export default connect(mapStateToProps)(AdminEditUser)
