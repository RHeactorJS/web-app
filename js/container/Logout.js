import { connect } from 'react-redux'
import Logout from '../component/Logout'
import { logout } from '../state/auth'

const mapDispatchToProps = ({
  onLogout: logout
})

export default connect(undefined, mapDispatchToProps)(Logout)
