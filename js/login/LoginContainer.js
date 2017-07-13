import { connect } from 'react-redux'
import Login from './Login'

const mapStateToProps = ({auth: {token, error}}) => ({
  token,
  error
})

export default connect(mapStateToProps)(Login)
