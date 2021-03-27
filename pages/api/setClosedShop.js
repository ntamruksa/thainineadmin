const {
  connectToDatabaseUsingCache,
  addUpdateMeta,
} = require('../../services/db')
const { isUserAdmin } = require('./utils/authHelper')
let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const { authorization } = req.headers
  const isAdmin = await isUserAdmin(authorization, db)
  if (isAdmin) {
    const {
      query: { isClosedShop },
    } = req
    const isTodayClosed = isClosedShop === 'true'
    const result = await db
      .collection('tech_configs')
      .updateOne(
        { key: 'onlineShop' },
        { $set: addUpdateMeta({ isTodayClosed }) }
      )
    res.status(200).json(result)
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}
