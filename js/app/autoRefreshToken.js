import { debounce } from 'lodash'
import { refreshToken } from '../login/actions'

// Refresh token on user activity
export const autoRefreshToken = ({dispatch, getState}) => {
  const maybeRefreshToken = debounce(() => {
    const token = getState().auth.token
    if (!token) return
    if (Math.max(token.exp.getTime() - Date.now(), 0) / (token.exp.getTime() - token.iat.getTime()) < 0.10) {
      console.debug('Auto refreshing token …')
      dispatch(refreshToken())
    }
  }, 10000)
  document.documentElement.addEventListener('click', maybeRefreshToken)
  document.documentElement.addEventListener('keyup', maybeRefreshToken)
}
