import { connect } from 'react-redux'
import AccountProfile from '../component/AccountProfile'
import { userUpdated } from '../state/auth'
import { initialize } from 'redux-form'

const mapStateToProps = ({config: {apiIndex, mimeType}, auth: {token, user, autologinComplete}}) => ({
  apiIndex,
  mimeType,
  token,
  user,
  autologinComplete
})

const mapDispatchToProps = ({
  onUserUpdate: userUpdated,
  initializeForm: (formName, values) => initialize(formName, values)
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountProfile)
