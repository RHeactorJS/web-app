import { connect } from 'react-redux'
import Registration from './Registration'

const mapStateToProps = ({registration: {success, error}}) => ({
  success,
  error
})

export default connect(mapStateToProps)(Registration)
