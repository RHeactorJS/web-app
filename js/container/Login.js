import { connect } from 'react-redux'
import Login from '../component/Login'

const mapStateToProps = ({config: {apiIndex, mimeType}, auth: {token, error}}) => ({
  apiIndex,
  mimeType,
  token,
  error
})

export default connect(mapStateToProps)(Login)
