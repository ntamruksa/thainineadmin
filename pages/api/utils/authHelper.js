const {
  findNotDeletedAndNotDisabled,
} = require('../../../services/db')
const admin = require('firebase-admin')

export async function isUserAdmin(authorization, db) {
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