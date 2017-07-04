import { connect } from 'react-redux'
import Activation from '../component/Activation'
import { success, error } from '../state/activation'

const mapStateToProps = ({config: {apiIndex, mimeType}, activation: {activated, problem}}) => ({
  apiIndex,
  mimeType,
  activated,
  problem
})

const mapDispatchToProps = ({
  onSuccess: success,
  onError: error
})

export default connect(mapStateToProps, mapDispatchToProps)(Activation)
