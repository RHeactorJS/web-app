import { connect } from 'react-redux'
import Home from '../component/home'

const mapStateToProps = ({auth: {token}}) => ({
  token
})

export default connect(mapStateToProps)(Home)
