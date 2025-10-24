// Appwrite Function: createUser
// Purpose: create an Appwrite auth user and a corresponding profile document
// Security: This function runs with an admin key (APPWRITE_API_KEY) and should NOT be bundled into the mobile client.
// Environment variables required on the function:
// - APPWRITE_ENDPOINT
// - APPWRITE_PROJECT_ID
// - APPWRITE_API_KEY  (server/admin key)
// - APPWRITE_DATABASE_ID
// - APPWRITE_USERS_COLLECTION_ID
// Optional:
// - APPWRITE_STORE_PASSWORD_HASH = '1'  (if set, the server will store a bcrypt hash in the user doc under `hashedPassword`)

import { Client, Account, Databases, ID as _ID } from 'node-appwrite'
import { hash } from 'bcryptjs'

function readEventData() {
  try {
    return JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA || '{}')
  } catch (err) {
    return {}
  }
}

;(async () => {
  const payload = readEventData()
  const email = (payload.email || '').toString().trim()
  const password = (payload.password || '').toString()
  const username = (payload.username || '').toString().trim()

  const response = { success: false }

  if (!email || !password) {
    response.error = 'email and password are required'
    console.log(JSON.stringify(response))
    return
  }

  if (password.length < 6) {
    response.error = 'password must be at least 6 characters'
    console.log(JSON.stringify(response))
    return
  }

  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailRe.test(email)) {
    // Entrypoint: delegate to modularized main
    try {
      require('./src/main')
    } catch (err) {
      // If require fails, log and rethrow so function shows failure
      try { console.log(JSON.stringify({ success: false, error: String(err) })) } catch (e) { console.log('error', String(err)) }
      throw err
    }
    .setKey(process.env.APPWRITE_API_KEY)
