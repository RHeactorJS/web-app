import { connect } from 'react-redux'
import AdminUsers from './AdminUsers'

const mapStateToProps = ({auth: {user, autologinComplete}, admin: { fetchingUsers, usersList, userQuery }}) => ({
  user,
  autologinComplete,
  fetchingUsers,
  usersList,
  userQuery
})

export default connect(mapStateToProps)(AdminUsers)
