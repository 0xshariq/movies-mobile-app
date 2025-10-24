const { logJson } = require('./logger')
const { validateEmail, validatePassword } = require('./validators')
const { createUserProfile } = require('./userService')

function readEventData() {
  try {
    return JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA || '{}')
  } catch (e) {
    return {}
  }
}

;(async () => {
  const payload = readEventData()
  const email = (payload.email || '').toString().trim()
  const password = (payload.password || '').toString()
  const username = (payload.username || '').toString().trim()

  const validationEmail = validateEmail(email)
  if (validationEmail) {
    return logJson({ success: false, error: validationEmail })
  }

  const validationPassword = validatePassword(password)
  if (validationPassword) {
    return logJson({ success: false, error: validationPassword })
  }

  try {
    const { user, doc } = await createUserProfile({ email, password, username })
    return logJson({ success: true, userId: user.$id, docId: doc.$id })
  } catch (err) {
    const msg = err && err.message ? err.message : String(err)
    if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
      return logJson({ success: false, error: 'email already exists', details: msg })
    }
    return logJson({ success: false, error: msg })
  }
})()
