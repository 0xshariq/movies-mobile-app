const sdk = require('node-appwrite')

function createClient() {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)

  const account = new sdk.Account(client)
  const databases = new sdk.Databases(client)
  const ID = sdk.ID

  return { client, account, databases, ID }
}

module.exports = { createClient }
