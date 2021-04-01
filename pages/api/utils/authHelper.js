const {
  findNotDeletedAndNotDisabled,
} = require('../../../services/db')
const admin = require('firebase-admin')
const serviceAccount = require('../../../services/baiyok-firebase-admin.json')

export async function isUserAdmin(authorization, db) {
  serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  } catch (e) {
    console.warn(`Issue on firebase admin init: ${e.message}`)
  }
  const decodedToken = await admin.auth().verifyIdToken(authorization)
  const user = await db.collection('users').findOne(
    findNotDeletedAndNotDisabled({
      uid: decodedToken.user_id,
      isAdminUser: true,
    })
  )
  if (user) {
    return true
  } else {
    return false
  }
}