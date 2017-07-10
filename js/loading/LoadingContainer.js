import { connect } from 'react-redux'
import Loading from './Loading'

const mapStateToProps = ({config, loading}) => ({
  appName: config.appName,
  loading: loading
})

export default connect(mapStateToProps)(Loading)
