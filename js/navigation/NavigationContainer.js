import { connect } from 'react-redux'
import Navigation from './Navigation'

const mapStateToProps = ({config, status, auth: {token, me, refreshingToken}}) => ({
  appName: config.appName,
  connected: status.status === 'ok',
  refreshingToken,
  token,
  me
})

export default connect(mapStateToProps)(Navigation)
