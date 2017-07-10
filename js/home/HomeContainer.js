import { connect } from 'react-redux'
import Home from './Home'

const mapStateToProps = ({auth: {token}}) => ({
  token
})

export default connect(mapStateToProps)(Home)
