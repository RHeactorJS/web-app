import { connect } from 'react-redux'
import Registration from '../component/Registration'

const mapStateToProps = ({config: {apiIndex, mimeType}, registration: {success, error}}) => ({
  apiIndex,
  mimeType,
  success,
  error
})

export default connect(mapStateToProps)(Registration)
