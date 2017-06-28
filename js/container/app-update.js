import { connect } from 'react-redux'
import AppUpdate from '../component/app-update'

const mapStateToProps = ({status, config}) => ({
  appName: config.appName,
  frontendVersion: config.version,
  backendVersion: status.version
})

export default connect(mapStateToProps)(AppUpdate)
