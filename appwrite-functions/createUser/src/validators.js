function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'email is required'
  const e = email.trim()
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!re.test(e)) return 'invalid email format'
  return null
}

function validatePassword(pw) {
  if (!pw || typeof pw !== 'string') return 'password is required'
  if (pw.length < 6) return 'password must be at least 6 characters'
  return null
}

module.exports = { validateEmail, validatePassword }
