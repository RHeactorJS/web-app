import { connect } from 'react-redux'
import Activation from '../component/Activation'

const mapStateToProps = ({config: {apiIndex, mimeType}, activation: {activated, problem}}) => ({
  apiIndex,
  mimeType,
  activated,
  activationProblem: problem
})

export default connect(mapStateToProps)(Activation)
