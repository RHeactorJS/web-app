import { connect } from 'react-redux'
import Registration from '../component/Registration'

const mapStateToProps = ({config: {apiIndex, mimeType}}) => ({
  apiIndex,
  mimeType
})

export default connect(mapStateToProps)(Registration)
