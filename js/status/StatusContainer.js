import { connect } from 'react-redux'
import Status from './Status'

const mapStateToProps = ({status, config}) => ({
  frontendVersion: config.version,
  backendVersion: status.version
})

export default connect(mapStateToProps)(Status)
