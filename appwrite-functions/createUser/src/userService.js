const { createClient } = require('./client')
const bcrypt = require('bcryptjs')

async function createUserProfile({ email, password, username }) {
  const { account, databases, ID } = createClient()
  // create auth user
  const user = await account.create(ID.unique(), email, password, username || undefined)

  // optionally store hashed password if env var set
  let hashedPassword = null
  if (String(process.env.APPWRITE_STORE_PASSWORD_HASH || '').toLowerCase() === '1') {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  const databaseId = process.env.APPWRITE_DATABASE_ID
  const usersCollection = process.env.APPWRITE_USERS_COLLECTION_ID

  const docPayload = {
    userId: user.$id,
    email: email,
    username: username || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  }

  if (hashedPassword) docPayload.hashedPassword = hashedPassword

  const doc = await databases.createDocument(databaseId, usersCollection, user.$id, docPayload)

  return { user, doc }
}

module.exports = { createUserProfile }
