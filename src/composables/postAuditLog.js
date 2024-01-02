import { store } from '../store'

const postAuditLog = async (data) => {
  if (!store.pangeaSession) {
    console.log(`${data.action} failed to log.`, 'Signed out.')
    return false
  }

  fetch('/api/audit-log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ store.pangeaSession?.user?.active_token?.token }`
    },
    body: JSON.stringify(data)
  }).catch((e) => {
    console.log(`${data.action} failed to log.`, e)
  })

  return true
}

export {
  postAuditLog
}