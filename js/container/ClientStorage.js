import { connect } from 'react-redux'
import { LoadUserDataFromClientStorage as _LoadUserDataFromClientStorage, ClientStorageProperty } from '../component/ClientStorage'
import { token, user, autologinComplete } from '../state/auth'

const mapStateToProps = ({auth: {token, user, autologinComplete}}) => ({
  token,
  user,
  autologinComplete
})

const mapDispatchToProps = ({
  onToken: token,
  onUser: user,
  onAutoLoginComplete: autologinComplete
})

export const LoadUserDataFromClientStorage = connect(mapStateToProps, mapDispatchToProps)(_LoadUserDataFromClientStorage)
export const ClientStoragePropertyToken = connect(({auth: {token}}) => ({value: token}))(ClientStorageProperty)
export const ClientStoragePropertyUser = connect(({auth: {user}}) => ({value: user}))(ClientStorageProperty)
