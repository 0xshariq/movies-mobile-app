import { Client, Account, Databases, Functions, Query } from 'appwrite'

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '')

export const account = new Account(client)
export const databases = new Databases(client)
export const functions = new Functions(client)
export { Query }

export default client
