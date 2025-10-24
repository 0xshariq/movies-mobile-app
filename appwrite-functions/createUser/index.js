// Appwrite Function: createUser (single-file)
// Creates an Appwrite auth user and a profile document.
// Run this as an Appwrite Node.js function. Set these env vars on the function:
// APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY (admin),
// APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION_ID
// Optional: APPWRITE_STORE_PASSWORD_HASH = '1' to store bcrypt hash in the profile (not recommended)

import { Client, Account, Databases, ID as _ID } from 'node-appwrite'
import { hash } from 'bcryptjs'

function readEventData() {
  try {
    return JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA || '{}')
  } catch (_) {
    return {}
  }
}

;(async () => {
  const payload = readEventData()
  const email = (payload.email || '').toString().trim()
  const password = (payload.password || '').toString()
  const username = (payload.username || '').toString().trim()

  const result = { success: false }

  if (!email || !password) {
    result.error = 'email and password are required'
    console.log(JSON.stringify(result))
    return
  }

  if (password.length < 6) {
    result.error = 'password must be at least 6 characters'
    console.log(JSON.stringify(result))
    return
  }

  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailRe.test(email)) {
    result.error = 'invalid email format'
    console.log(JSON.stringify(result))
    return
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)

  const account = new Account(client)
  const databases = new Databases(client)
  const ID = _ID

  try {
    // create Appwrite auth user
    const user = await account.create(ID.unique(), email, password, username || undefined)

    // optionally store a bcrypt hashed password (only if explicitly enabled)
    let hashedPassword = null
    if (String(process.env.APPWRITE_STORE_PASSWORD_HASH || '').toLowerCase() === '1') {
      hashedPassword = await hash(password, 10)
    }

    const databaseId = process.env.APPWRITE_DATABASE_ID
    const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID

    const docPayload = {
      userId: user.$id,
      email,
      username: username || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    }

    if (hashedPassword) docPayload.hashedPassword = hashedPassword

    const doc = await databases.createDocument(databaseId, usersCollection, user.$id, docPayload)

    result.success = true
    result.userId = user.$id
    result.docId = doc.$id
    result.message = 'user created'
    console.log(JSON.stringify(result))
    return
  } catch (err) {
    const msg = err && err.message ? err.message : String(err)
    if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
      console.log(JSON.stringify({ success: false, error: 'email already exists', details: msg }))
      return
    }
    console.log(JSON.stringify({ success: false, error: msg }))
    return
  }
})()
