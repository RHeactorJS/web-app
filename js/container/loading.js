import { connect } from 'react-redux'
import Loading from '../component/loading'

const mapStateToProps = ({config, loading}) => ({
  appName: config.appName,
  loading: loading
})

export default connect(mapStateToProps)(Loading)
