import { connect } from 'react-redux'
import PasswordChange from '../component/PasswordChange'

const mapStateToProps = ({config: {apiIndex, mimeType}}) => ({
  apiIndex,
  mimeType
})

export default connect(mapStateToProps)(PasswordChange)
