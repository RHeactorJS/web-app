import { connect } from 'react-redux'
import Activation from './Activation'

const mapStateToProps = ({registration: {activated, activationError}}) => ({
  activated,
  error: activationError
})

export default connect(mapStateToProps)(Activation)
