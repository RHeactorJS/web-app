import { connect } from 'react-redux'
import Navigation from '../component/navigation'

const mapStateToProps = ({config, status, auth: {token, user}}) => ({
  appName: config.appName,
  connected: status.status === 'ok',
  token,
  user
})

export default connect(mapStateToProps)(Navigation)
