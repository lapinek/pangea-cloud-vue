import { generateBase58, getLocalStorageItem, setLocalStorageItem } from '../utils'
import { store } from '../store'

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
   * Introspect session on the authorization server.
   */
  try {
    console.log('Introspecting user session on the authorization server.')
    const response = await fetch(`https://authn.${import.meta.env.VITE_PANGEA_AUTHN_DOMAIN}/v2/client/session/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PANGEA_AUTHN_CLIENT_TOKEN}`
      },
      body: JSON.stringify({
        'token': pangeaSession.user.active_token.token
      })
    })
    const result = await response.json()
    if (result.status !== 'Success') {
      console.log('Signed out on the authorization server.', result.status)
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
    const response = await fetch(`https://authn.${import.meta.env.VITE_PANGEA_AUTHN_DOMAIN}/v2/client/session/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PANGEA_AUTHN_CLIENT_TOKEN}`
      },
      body: JSON.stringify({
        'refresh_token': pangeaSession.user.refresh_token.token
      })
    })
    const result = await response.json()
    if (result.status !== 'Success') {
      console.log('Failed to refresh the session on the authorization server.', result.status)
      return false
    }

    pangeaSession.user = {
      email: result.result.active_token.email,
      profile: result.result.active_token.profile,
      active_token: result.result.active_token,
      refresh_token: result.result.refresh_token
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
  const state = generateBase58(32)
  localStorage.setItem('state', state)

  let localRedirectUri = import.meta.env.VITE_PANGEA_AUTHN_REDIRECT_URI

  const query = new URLSearchParams('')
  query.append('redirect_uri', localRedirectUri)
  query.append('state', localStorage.getItem('state'))

  const queryParams = query.toString()
  const redirectTo = import.meta.env.VITE_PANGEA_AUTHN_LOGIN_URL
  const url = queryParams ? `${redirectTo}?${queryParams}` : redirectTo

  window.location.replace(url)
}

const redirect = async (route) => {
  const state = localStorage.getItem('state')
  localStorage.removeItem('state')
  if (state !== route.query.state) {
    return false
  }
  let userinfo
  try {
    const response = await fetch(`https://authn.${import.meta.env.VITE_PANGEA_AUTHN_DOMAIN}/v2/client/userinfo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PANGEA_AUTHN_CLIENT_TOKEN}`,
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
    console.log('userinfo', userinfo)

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
    return false
  }
  return true
}

const signOut = async () => {
  console.log('Signing out on the authorization server.')
  const pangeaSession = getLocalStorageItem('pangea-session')
  if (pangeaSession) {
    try {
      const response = await fetch(`https://authn.${import.meta.env.VITE_PANGEA_AUTHN_DOMAIN}/v2/client/session/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PANGEA_AUTHN_CLIENT_TOKEN}`
        },
        body: JSON.stringify({
          'token': pangeaSession.user.active_token.token
        })
      })
      const result = await response.json()
      if (result.status !== 'Success') {
        console.log('Failed to sign out on the authorization server.', result.status)
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
