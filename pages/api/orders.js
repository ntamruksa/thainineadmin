const { connectToDatabaseUsingCache } = require('../../services/db')
const { isUserAdmin } = require('./utils/authHelper')
let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const { authorization } = req.headers
  const isAdmin = await isUserAdmin(authorization, db)
  if (isAdmin) {
    let {
      query: { status = '', today = true },
    } = req
    let q = { status: { $regex: `.*${status}.*`, $options: 'i' } }
    if (today) {
      let start = new Date()
      start.setHours(0, 0, 0, 0)
      let end = new Date()
      end.setHours(23, 59, 59, 999)
      q = { ...q, createdDate: { $gte: start, $lt: end } }
    }
    const orders = await db
      .collection('orders')
      .find(q)
      .sort({ pickupTime: 1 })
      .toArray()
    res.status(200).json(orders)
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}
