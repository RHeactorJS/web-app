import { connect } from 'react-redux'
import Navigation from './Navigation'

const mapStateToProps = ({config, status, auth: {token, user, refreshingToken}}) => ({
  appName: config.appName,
  connected: status.status === 'ok',
  refreshingToken,
  token,
  user
})

export default connect(mapStateToProps)(Navigation)
