import { connect } from 'react-redux'
import Login from '../component/Login'
import { authenticate } from '../state/auth'

const mapStateToProps = ({config: {apiIndex, mimeType}, auth: {token}}) => ({
  apiIndex,
  mimeType,
  token
})

const mapDispatchToProps = ({
  onLogin: authenticate
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
