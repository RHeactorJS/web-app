import { connect } from 'react-redux'
import AdminUsers from './AdminUsers'

const mapStateToProps = ({auth: {me, autologinComplete}, adminUsers: {fetching, users, query, creating, error, success}}) => ({
  me,
  autologinComplete,
  fetching,
  users,
  query,
  creating,
  error,
  success
})

export default connect(mapStateToProps)(AdminUsers)
