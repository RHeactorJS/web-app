import { connect } from 'react-redux'
import Navigation from '../component/navigation'

const mapStateToProps = ({config, status}) => ({
  appName: config.appName,
  connected: status.status === 'ok',
  loggedIn: false
})

export default connect(mapStateToProps)(Navigation)
