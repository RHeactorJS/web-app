import { connect } from 'react-redux'
import AdminUsers from './AdminUsers'

const mapStateToProps = ({auth: {user, autologinComplete}, admin: {fetchingUsers, usersList, userQuery, creatingUser, createUserError, createUserSuccess}}) => ({
  user,
  autologinComplete,
  fetchingUsers,
  usersList,
  userQuery,
  creatingUser,
  createUserError,
  createUserSuccess
})

export default connect(mapStateToProps)(AdminUsers)
