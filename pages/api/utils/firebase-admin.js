const admin = require('firebase-admin')
const firebaseTenant = {} // IMPORATNT this need to be outside of the handler function
// const serviceAccount = process.env.FIREBASE_ADMIN
const serviceAccount = require('../../../services/baiyok-firebase-admin.json')

const getFirebaseAdmin = async () => {
  const errorObject = {
    statusCode: 404,
    body: JSON.stringify({
      type: 'error',
      code: 'resource-not-found',
      title: 'Firebase config is missing'
    })
  }
  if (firebaseTenant.DEFAULT) {
    return firebaseTenant.DEFAULT
  } else {
    serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY
    firebaseTenant.DEFAULT = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
      // databaseURL: tenantConfig.firebase.firebaseConfig.databaseURL
    })
    if (firebaseTenant.DEFAULT) {
      return firebaseTenant.DEFAULT
    } else {
      return errorObject
    }
  }
}

export { getFirebaseAdmin }
