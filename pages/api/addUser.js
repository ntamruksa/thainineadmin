const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const user = req.body.user
  user.createdDate = new Date()
  const existingUser = await db.collection('users').findOne({uid: user.uid})
  console.log('existingUser', existingUser)
  if (existingUser) {
    res.status(200).json({isAdminUser: existingUser.isAdminUser})
  } else {
    const result = await db.collection('users').insertOne(user)
    res.status(200).json(result)
  }
}
