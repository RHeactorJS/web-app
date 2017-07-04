import { connect } from 'react-redux'
import AccountEmailChangeConfirm from '../component/AccountEmailChangeConfirm'
import { success, error } from '../state/accountEmailChangeConfirm'

const mapStateToProps = ({config: {apiIndex, mimeType}, auth: {token, user, autologinComplete}, accountEmailChangeConfirm: {confirmed, problem}}) => ({
  apiIndex,
  mimeType,
  confirmed,
  problem,
  user,
  autologinComplete
})

const mapDispatchToProps = ({
  onSuccess: t => success(t.payload.email),
  onError: error
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountEmailChangeConfirm)
