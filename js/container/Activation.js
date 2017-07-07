import { connect } from 'react-redux'
import Activation from '../component/Activation'

const mapStateToProps = ({config: {apiIndex, mimeType}, activation: {activated, error}}) => ({
  apiIndex,
  mimeType,
  activated,
  error
})

export default connect(mapStateToProps)(Activation)
