import { CLIENT_ID, FRONTEND_ROOT } from './constants'

const oidcConfig = {
  onSignIn: () => {
    window.location.href = '/home'
  },
  authority: 'https://feid.ptudev.net',
  clientId: CLIENT_ID,
  redirectUri: `${FRONTEND_ROOT}/home`,
  postLogoutRedirectUri: `${FRONTEND_ROOT}/login`,
  scope: 'openid profile offline_access',
  responseType: 'code',
  autoSignIn: false,
}
export default oidcConfig
