import { generateState, getLocalStorageItem, setLocalStorageItem } from '../utils'
import { store } from '../store'

console.log('environment', import.meta.env)

const PANGEA_AUTHN_LOGIN_URL = import.meta.env.VITE_PANGEA_AUTHN_LOGIN_URL
const PANGEA_DOMAIN = import.meta.env.VITE_PANGEA_DOMAIN
const PANGEA_AUTHN_TOKEN = import.meta.env.VITE_PANGEA_AUTHN_CLIENT_TOKEN
const PANGEA_AUTHN_REDIRECT_URI = import.meta.env.VITE_PANGEA_AUTHN_REDIRECT_URI

const isAuthenticated = async () => {
  const pangeaSession = getLocalStorageItem('pangea-session')

  if (!pangeaSession) {
    await signOut()
    return false
  }

  const timeLeft = (new Date(pangeaSession.user?.active_token?.expire) - Date.now())
  if (Math.sign(timeLeft) !== 1) {
    await signOut()
    return false
  }

  /**
   * Introspect active token on the authorization server.
   */
  try {
    console.log('Introspecting user session on the authorization server.')
    const response = await fetch(`https://authn.${PANGEA_DOMAIN}/v2/client/token/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PANGEA_AUTHN_TOKEN}`
      },
      body: JSON.stringify({
        'token': pangeaSession.user.active_token.token
      })
    })
    const responseBody = await response.json()
    if (responseBody.status !== 'Success') {
      console.log('Signed out on the authorization server.', responseBody.status)
      await signOut()
      return false
    }
  } catch (e) {
    console.log('Failed to introspect session on the authorization server.', e.message)
    await signOut()
    return false
  }

  store.setSession(pangeaSession)

  return true
}

const refresh = async () => {
  const pangeaSession = getLocalStorageItem('pangea-session')

  if (!pangeaSession) {
    await signOut()
    return false
  }

  /**
   * Refresh the session on the authorization server.
   */
  try {
    console.log('Refreshing user session on the authorization server.')
    const response = await fetch(`https://authn.${PANGEA_DOMAIN}/v2/client/session/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PANGEA_AUTHN_TOKEN}`
      },
      body: JSON.stringify({
        'refresh_token': pangeaSession.user.refresh_token.token
      })
    })
    const responseBody = await response.json()
    if (responseBody.status !== 'Success') {
      console.log('Failed to refresh the session on the authorization server.', responseBody.status)
      return false
    }

    pangeaSession.user = {
      email: responseBody.result.active_token.email,
      profile: responseBody.result.active_token.profile,
      active_token: responseBody.result.active_token,
      refresh_token: responseBody.result.refresh_token
    }
    delete pangeaSession.user.active_token.email
    delete pangeaSession.user.active_token.profile
    delete pangeaSession.user.refresh_token.email
    delete pangeaSession.user.refresh_token.profile
  } catch (e) {
    console.log('Failed to refresh the session on the authorization server.', e.message)
    return false
  }

  setLocalStorageItem('pangea-session', pangeaSession)
  store.setSession(pangeaSession)

  return true
}

const signIn = () => {
  generateState()

  const query = new URLSearchParams("")
  query.append("redirect_uri", PANGEA_AUTHN_REDIRECT_URI)
  query.append("state", localStorage.getItem("state"))

  const redirectUri = `${PANGEA_AUTHN_LOGIN_URL}?${String(query)}`

  window.location.replace(redirectUri)
}

const redirect = async (route) => {
  const state = localStorage.getItem('state')
  localStorage.removeItem('state')
  if (state !== route.query.state) {
    return false
  }
  let userinfo
  try {
    const response = await fetch(`https://authn.${PANGEA_DOMAIN}/v2/client/userinfo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PANGEA_AUTHN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: route.query.code
      })
    })
    userinfo = await response.json()
  } catch (e) {
    console.log('Failed to fetch tokens.', e.message)
  }

  if (userinfo?.status === 'Success') {
    /**
     * Show full userinfo response.
     */
    console.log('userinfo', structuredClone(userinfo))

    /**
     * Construct user profile.
     */
    const user = {
      email: userinfo.result.active_token.email,
      profile: userinfo.result.active_token.profile,
      active_token: userinfo.result.active_token,
      refresh_token: userinfo.result.refresh_token
    }
    delete user.active_token.email
    delete user.active_token.profile
    delete user.refresh_token.email
    delete user.refresh_token.profile
    localStorage.setItem('pangea-session', JSON.stringify({
      user
    }))
  } else {
    // return false
  }
  return true
}

const signOut = async () => {
  console.log('Signing out on the authorization server.')
  const pangeaSession = getLocalStorageItem('pangea-session')
  if (pangeaSession) {
    try {
      const response = await fetch(`https://authn.${PANGEA_DOMAIN}/v2/client/session/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PANGEA_AUTHN_TOKEN}`
        },
        body: JSON.stringify({
          'token': pangeaSession.user.active_token.token
        })
      })
      const responseBody = await response.json()
      if (responseBody.status !== 'Success') {
        console.log('Failed to sign out on the authorization server.', responseBody.status)
      }
    } catch (e) {
      console.log('Failed to sign out on the authorization server.', e.message)
      return false
    }
  } else {
    console.log(
      'Failed to sign out on the authorization server: no local session found.'
    )
  }

  console.log('Signing out locally.')
  localStorage.removeItem('pangea-session')
  store.unsetSession()

  return true
}

export {
  isAuthenticated,
  signIn,
  redirect,
  signOut,
  refresh
}
