import { connect } from 'react-redux'
import Status from '../component/status'

const mapStateToProps = ({status, config}) => ({
  frontendVersion: config.version,
  backendVersion: status.version
})

export default connect(mapStateToProps)(Status)
