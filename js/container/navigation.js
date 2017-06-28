import { connect } from 'react-redux'
import Navigation from '../component/navigation'

const mapStateToProps = ({config}) => ({
  appName: config.appName,
  loggedIn: false
})

export default connect(mapStateToProps)(Navigation)
