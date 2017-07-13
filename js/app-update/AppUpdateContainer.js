import { connect } from 'react-redux'
import AppUpdate from './AppUpdate'

const mapStateToProps = ({status, config}) => ({
  appName: config.appName,
  frontendVersion: config.version,
  backendVersion: status.version
})

export default connect(mapStateToProps)(AppUpdate)
