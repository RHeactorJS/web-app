import { connect } from 'react-redux'
import Status from '../component/status'

const mapStateToProps = ({status}) => {
  return ({
    frontendVersion: status.frontendVersion,
    backendVersion: status.status ? status.status.version : false
  })
}

export default connect(mapStateToProps)(Status)
