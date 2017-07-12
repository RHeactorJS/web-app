import { connect } from 'react-redux'
import AdminUsers from './AdminUsers'

const mapStateToProps = ({auth: {me, autologinComplete}, admin: {fetchingUsers, usersList, userQuery, creatingUser, createUserError, createUserSuccess}}) => ({
  me,
  autologinComplete,
  fetchingUsers,
  usersList,
  userQuery,
  creatingUser,
  createUserError,
  createUserSuccess
})

export default connect(mapStateToProps)(AdminUsers)
